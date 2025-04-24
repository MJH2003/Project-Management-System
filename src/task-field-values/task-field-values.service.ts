import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTaskFieldValueDto } from './dto/create-task-field-value.dto';
import { FieldType } from '@prisma/client';

@Injectable()
export class TaskFieldValuesService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateTaskFieldValueDto) {
    const field = await this.db.customField.findUnique({
      where: { id: dto.fieldId },
    });
    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    if (!this.validateType(dto.value, field)) {
      throw new BadRequestException(
        `Value type does not match expected type: ${field.type}`,
      );
    }

    return await this.db.taskFieldValue.upsert({
      where: {
        taskId_fieldId: {
          taskId: dto.taskId,
          fieldId: dto.fieldId,
        },
      },
      create: {
        taskId: dto.taskId,
        fieldId: dto.fieldId,
        value: dto.value,
      },
      update: {
        value: dto.value,
      },
    });
  }

  async findByTask(taskId: string) {
    return await this.db.taskFieldValue.findMany({
      where: { taskId },
      include: { field: true },
    });
  }

  private validateType(value: any, field: any): boolean {
    switch (field.type) {
      case 'STRING':
        return typeof value === 'string';
      case 'NUMBER':
        return typeof value === 'number';
      case 'DATE':
        return typeof value === 'string' && !isNaN(Date.parse(value));
      case 'BOOLEAN':
        return typeof value === 'boolean';
      case 'SELECT':
        if (typeof value !== 'string') return false;
        const options = field.options as string[];
        return Array.isArray(options) && options.includes(value);
      default:
        return false;
    }
  }
}
