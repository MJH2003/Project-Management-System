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

    if (object.type === FieldType.SELECT) {
      return (
        Array.isArray(options) &&
        options.length > 0 &&
        options.every((opt) => typeof opt === 'string' && opt.trim() !== '')
      );
    }

    if (object.type === FieldType.BOOLEAN) {
      return options === undefined;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateCustomFieldDto;

    if (object.type === FieldType.SELECT) {
      return 'SELECT fields require at least one non-empty option';
    }
    if (object.type === FieldType.BOOLEAN) {
      return 'BOOLEAN fields must not have options';
    }

    return 'Invalid options';
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
}
