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
import { DataSourceService, OptionItem, SourceContextData } from './date-source.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { DbService } from 'src/db/db.service';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { AddSelectOptionsDto } from './dto/add-select-options.dto';
import { DataSourceType } from '@prisma/client';
import { Prisma } from '@prisma/client';

interface SelectFieldOptions {
  options: string[];
}

@Controller('custom-fields')
export class CustomFieldsController {
  constructor(
    private readonly service: CustomFieldsService,
    private readonly dataSourceService: DataSourceService,
    private readonly db: DbService,
  ) {}

  @Post()
  async create(@Body() dto: CreateCustomFieldDto) {
    return await this.service.create(dto);
  }

  @Post(':id/options')
  async addOptions(@Param('id') id: string, @Body() dto: AddSelectOptionsDto) {
    return await this.service.addSelectOptions(id, dto);
  }

  @Get()
  async findByProject(@Query('projectId') projectId: string) {
    return await this.service.findByProject(projectId);
  }

  @Get('data-sources')
  async getDataSources() {
    return await this.dataSourceService.getAllSourceTypes();
  }

  @Get(':id/options')
  async getSelectOptions(
    @Param('id') id: string,
    @Query('projectId') projectId: string,
    @Request() req,
  ): Promise<OptionItem[]> {
    const field = await this.service.findOne(id);

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    if (field.type !== 'SELECT') {
      throw new BadRequestException('Field is not of type SELECT');
    }

    if (!field.sourceType) {
      const options = field.options as string[];
      return options.map(option => ({
        id: option,
        value: option,
        label: option
      }));
    }

    const contextData: SourceContextData = {
      projectId,
      userId: req.user?.userId
    };

    return await this.dataSourceService.getSourceData(field.sourceType as DataSourceType, contextData);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const field = await this.db.customField.findUnique({
      where: { id },
    });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    return field;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomFieldDto) {
    return await this.service.update(id, dto);
  }
}
