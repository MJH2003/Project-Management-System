import { IsUUID, IsNotEmpty, IsDefined, IsObject } from 'class-validator';

export class CreateTaskFieldValueDto {
  @IsUUID()
  taskId: string;

  @IsUUID()
  fieldId: string;

  @IsDefined()
  value: any;
}
