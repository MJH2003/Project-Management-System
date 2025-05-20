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
    if (dto.type === 'DYNAMIC_SELECT' && !dto.dynamicSourceId) {
      throw new BadRequestException(
        'DYNAMIC_SELECT fields require a data source',
      );
    }

    if (dto.dynamicSourceId) {
      const source = await this.db.dynamicDataSource.findUnique({
        where: { id: dto.dynamicSourceId },
      });

      if (!source) {
        throw new NotFoundException('Dynamic data source not found');
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

    if (dto.type === 'DYNAMIC_SELECT' && dto.dynamicSourceId) {
      data.dynamicSource = {
        connect: { id: dto.dynamicSourceId },
      };
    }

    return await this.db.customField.create({ data });
  }

  async findByProject(projectId: string) {
    return await this.db.customField.findMany({
      where: { projectId },
      include: { dynamicSource: true },
    });
  }

  async findOne(id: string) {
    const field = await this.db.customField.findUnique({
      where: { id },
      include: { dynamicSource: true },
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

    if (dto.type === 'SELECT' && (!dto.options || dto.options.length === 0)) {
      throw new BadRequestException(
        'SELECT fields require at least one option',
      );
    }

    if (dto.type === 'DYNAMIC_SELECT' && !dto.dynamicSourceId) {
      throw new BadRequestException(
        'DYNAMIC_SELECT fields require a data source',
      );
    }

    if (dto.dynamicSourceId) {
      const source = await this.db.dynamicDataSource.findUnique({
        where: { id: dto.dynamicSourceId },
      });

      if (!source) {
        throw new NotFoundException('Dynamic data source not found');
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

    if (dto.type === 'DYNAMIC_SELECT' && dto.dynamicSourceId) {
      data.dynamicSource = {
        connect: { id: dto.dynamicSourceId },
      };
    } else {
      data.dynamicSource = { disconnect: true };
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
