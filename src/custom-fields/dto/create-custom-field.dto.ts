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
import { FieldType } from '@prisma/client';

@ValidatorConstraint({ name: 'OptionsValidator', async: false })
class OptionsValidator implements ValidatorConstraintInterface {
  validate(options: any, args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'SELECT') {
      return (
        Array.isArray(options) &&
        options.length > 0 &&
        options.every((opt) => typeof opt === 'string' && opt.trim() !== '')
      );
    }

    if (object.type === 'DYNAMIC_SELECT') {
      return options === undefined;
    }

    if (object.type === 'BOOLEAN') {
      return options === undefined;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'SELECT') {
      return 'SELECT fields require at least one non-empty option';
    }
    if (object.type === 'DYNAMIC_SELECT') {
      return 'DYNAMIC_SELECT fields should not have options, please provide dynamicSourceId instead';
    }
    if (object.type === 'BOOLEAN') {
      return 'BOOLEAN fields must not have options';
    }

    return 'Invalid options';
  }
}

@ValidatorConstraint({ name: 'DynamicSourceValidator', async: false })
class DynamicSourceValidator implements ValidatorConstraintInterface {
  validate(dynamicSourceId: any, args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'DYNAMIC_SELECT') {
      return (
        typeof dynamicSourceId === 'string' && dynamicSourceId.trim() !== ''
      );
    }

    return dynamicSourceId === undefined;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === 'DYNAMIC_SELECT') {
      return 'DYNAMIC_SELECT fields require a dynamicSourceId';
    }

    return 'Only DYNAMIC_SELECT fields should have a dynamicSourceId';
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

  @Validate(OptionsValidator)
  options?: string[];

  @IsOptional()
  @IsUUID()
  @Validate(DynamicSourceValidator)
  dynamicSourceId?: string;
}
