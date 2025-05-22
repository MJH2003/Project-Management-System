import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { FieldType } from '@prisma/client';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { AddSelectOptionsDto } from './dto/add-select-options.dto';

@Injectable()
export class CustomFieldsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateCustomFieldDto) {
    if (dto.type === 'SELECT') {
      if (!dto.sourceType && (!dto.options || dto.options.length === 0)) {
        throw new BadRequestException(
          'SELECT fields require either options or a sourceType',
        );
      }
    }

    const data: any = {
      name: dto.name,
      type: dto.type,
      isRequired: dto.isRequired ?? false,
      project: {
        connect: { id: dto.projectId },
      },
    };

    if (dto.type === 'SELECT' && dto.options) {
      data.options = dto.options;
    }

    if (dto.type === 'SELECT' && dto.sourceType) {
      data.sourceType = dto.sourceType;
    }

    return await this.db.customField.create({ data });
  }

  async findByProject(projectId: string) {
    return await this.db.customField.findMany({
      where: { projectId },
    });
  }

  async findOne(id: string) {
    const field = await this.db.customField.findUnique({
      where: { id },
    });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    return field;
  }

  async delete(id: string) {
    const exists = await this.db.customField.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Custom field not found');
    return await this.db.customField.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateCustomFieldDto) {
    const existing = await this.db.customField.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Custom field not found');
    }

    if (dto.type === 'SELECT') {
      if (
        dto.sourceType === null &&
        (!dto.options || dto.options.length === 0)
      ) {
        throw new BadRequestException(
          'SELECT fields without a sourceType require options',
        );
      }
    }

    const data: any = {
      name: dto.name,
      type: dto.type,
      isRequired: dto.isRequired,
    };

    if (dto.type === 'SELECT' && dto.options) {
      data.options = dto.options;
    }

    if (dto.type === 'SELECT') {
      if (dto.sourceType === null) {
        data.sourceType = null;
      } else if (dto.sourceType) {
        data.sourceType = dto.sourceType;
      }
    }

    return await this.db.customField.update({
      where: { id },
      data,
    });
  }

  async addSelectOptions(id: string, dto: AddSelectOptionsDto) {
    const field = await this.db.customField.findUnique({ where: { id } });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    if (field.type !== 'SELECT') {
      throw new BadRequestException(
        'Only SELECT fields can have options added',
      );
    }

    if (field.sourceType) {
      throw new BadRequestException(
        'Cannot add options to SELECT fields with a sourceType',
      );
    }

    const existingOptions = Array.isArray(field.options)
      ? (field.options as string[])
      : [];

    const updatedOptions = [...new Set([...existingOptions, ...dto.options])];

    return await this.db.customField.update({
      where: { id },
      data: { options: updatedOptions },
    });
  }
}
