import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be one of TODO, IN_PROGRESS, REVIEW, DONE',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority, {
    message: 'Priority must be one of LOW, MEDIUM, HIGH, URGENT',
  })
  priority?: Priority;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
