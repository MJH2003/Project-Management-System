import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { DbService } from 'src/db/db.service';

@Controller('custom-fields')
export class CustomFieldsController {
  constructor(
    private readonly service: CustomFieldsService,
    private readonly db: DbService,
  ) {}

  @Post()
  async create(@Body() dto: CreateCustomFieldDto) {
    return await this.service.create(dto);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string) {
    return await this.service.findByProject(projectId);
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

  @Get(':id/options')
  async getSelectOptions(@Param('id') id: string) {
    const field = await this.service.findOne(id);
    if (field.type !== 'SELECT') {
      throw new BadRequestException('Field is not of type SELECT');
    }
    return { options: field.options };
  }
}
