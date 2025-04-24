import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { FieldType } from '@prisma/client';

@Injectable()
export class CustomFieldsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateCustomFieldDto) {
    if (dto.type === 'SELECT' && (!dto.options || dto.options.length === 0)) {
      throw new BadRequestException(
        'SELECT fields require at least one option',
      );
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
}
