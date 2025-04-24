import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { FieldType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCustomFieldDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  isRequired?: boolean;

  @IsUUID()
  projectId: string;

  @ValidateIf((o) => o.type === 'SELECT')
  @IsArray()
  @IsNotEmpty({ each: true })
  options?: string[];
}
