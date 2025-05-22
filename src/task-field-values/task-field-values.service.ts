import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTaskFieldValueDto } from './dto/create-task-field-value.dto';
import { FieldType } from '@prisma/client';
import { DataSourceService } from '../custom-fields/date-source.service';

@Injectable()
export class TaskFieldValuesService {
  constructor(
    private readonly db: DbService,
    private readonly dataSourceService: DataSourceService,
  ) {}

  async create(dto: CreateTaskFieldValueDto) {
    const field = await this.db.customField.findUnique({
      where: { id: dto.fieldId },
    });

    if (!field) {
      throw new NotFoundException('Custom field not found');
    }

    const task = await this.db.task.findUnique({
      where: { id: dto.taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId !== field.projectId) {
      throw new BadRequestException(
        'Task and field must belong to the same project',
      );
    }

    if (field.type === 'SELECT' && field.sourceType) {
      await this.validateDynamicValue(dto.value, field, task.projectId);
    } else if (!this.validateType(dto.value, field)) {
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

        if (field.sourceType) return true;

        const options = field.options as string[];
        return Array.isArray(options) && options.includes(value);
      default:
        return false;
    }
  }

  private async validateDynamicValue(
    value: any,
    field: any,
    projectId: string,
  ): Promise<boolean> {
    if (!field.sourceType) {
      throw new BadRequestException(
        'SELECT field has no sourceType configured',
      );
    }

    const contextData = {
      projectId,
      userId: undefined,
    };

    const options = await this.dataSourceService.getSourceData(
      field.sourceType,
      contextData,
    );

    const validOption = options.some((option) => option.value === value);

    if (!validOption) {
      throw new BadRequestException(
        `The provided value is not valid for this field`,
      );
    }

    return true;
  }
}
