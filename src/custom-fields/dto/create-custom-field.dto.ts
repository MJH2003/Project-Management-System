import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FieldType, DataSourceType } from '@prisma/client';

@ValidatorConstraint({ name: 'SelectOptionsValidator', async: false })
class SelectOptionsValidator implements ValidatorConstraintInterface {
  validate(options: any, args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'SELECT') {
      if (object.sourceType) {
        return (
          options === undefined ||
          (Array.isArray(options) && options.length === 0)
        );
      }

      return (
        Array.isArray(options) &&
        options.length > 0 &&
        options.every((opt) => typeof opt === 'string' && opt.trim() !== '')
      );
    }

    return options === undefined;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'SELECT') {
      if (object.sourceType) {
        return 'SELECT fields with a sourceType should not have options';
      }
      return 'SELECT fields without a sourceType require at least one non-empty option';
    }

    return 'Only SELECT fields should have options';
  }
}

@ValidatorConstraint({ name: 'SourceTypeValidator', async: false })
class SourceTypeValidator implements ValidatorConstraintInterface {
  validate(sourceType: any, args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'SELECT') {
      return (
        sourceType === undefined ||
        Object.values(DataSourceType).includes(sourceType)
      );
    }

    return sourceType === undefined;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'SELECT') {
      return 'Invalid sourceType provided for SELECT field';
    }

    return 'Only SELECT fields can have a sourceType';
  }
}

export class CreateCustomFieldDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  isRequired?: boolean;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @Validate(SelectOptionsValidator)
  options?: string[];

  @IsOptional()
  @IsEnum(DataSourceType)
  @Validate(SourceTypeValidator)
  sourceType?: DataSourceType;
}
