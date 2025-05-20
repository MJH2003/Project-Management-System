import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  Query,
  Request,
} from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { DynamicDataSourceService } from './dynamic-data-sourse.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { DbService } from 'src/db/db.service';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { AddSelectOptionsDto } from './dto/add-select-options.dto';

@Controller('projects/:projectId/custom-fields')
export class CustomFieldsController {
  constructor(
    private readonly service: CustomFieldsService,
    private readonly dynamicSourceService: DynamicDataSourceService,
    private readonly db: DbService,
  ) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateCustomFieldDto,
  ) {
    dto.projectId = projectId;
    return await this.service.create(dto);
  }

  @Post(':id/options')
  async addOptions(@Param('id') id: string, @Body() dto: AddSelectOptionsDto) {
    return await this.service.addSelectOptions(id, dto);
  }

  @Get()
  async findByProject(@Param('projectId') projectId: string) {
    return await this.service.findByProject(projectId);
  }

  @Get('data-sources')
  async getDataSources() {
    return await this.dynamicSourceService.findAll();
  }

  @Get(':id/options')
  async getSelectOptions(@Param('id') id: string) {
    const field = await this.service.findOne(id);

    if (field.type === 'SELECT') {
      return { options: field.options };
    }

    if (field.type !== 'DYNAMIC_SELECT') {
      throw new BadRequestException(
        'Field is not of type SELECT or DYNAMIC_SELECT',
      );
    }

    if (!field.dynamicSource) {
      throw new BadRequestException(
        'Dynamic field has no data source configured',
      );
    }

    return { options: [] };
  }

  @Get(':id/dynamic-options')
  async getDynamicSelectOptions(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    const field = await this.service.findOne(id);

    if (field.projectId !== projectId) {
      throw new NotFoundException(
        'Custom field not found in the specified project',
      );
    }

    if (field.type !== 'DYNAMIC_SELECT') {
      throw new BadRequestException('Field is not of type DYNAMIC_SELECT');
    }

    if (!field.dynamicSource) {
      throw new BadRequestException(
        'Dynamic field has no data source configured',
      );
    }

    const contextData = {
      projectId,
      userId: req.user?.userId,
      taskId: req.query.taskId,
    };

    const options = await this.dynamicSourceService.getSourceData(
      field.dynamicSource.sourceType,
      contextData,
    );

    return { options };
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const field = await this.db.customField.findUnique({
      where: { id },
      include: { dynamicSource: true },
    });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    if (field.projectId !== projectId) {
      throw new NotFoundException(
        'Custom field not found in the specified project',
      );
    }

    return field;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Param('projectId') projectId: string) {
    const field = await this.db.customField.findUnique({ where: { id } });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    if (field.projectId !== projectId) {
      throw new NotFoundException(
        'Custom field not found in the specified project',
      );
    }

    return await this.service.delete(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateCustomFieldDto,
  ) {
    const field = await this.db.customField.findUnique({ where: { id } });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    if (field.projectId !== projectId) {
      throw new NotFoundException(
        'Custom field not found in the specified project',
      );
    }

    return await this.service.update(id, dto);
  }
}
