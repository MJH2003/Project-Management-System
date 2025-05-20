import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class AddSelectOptionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  options: string[];
}
