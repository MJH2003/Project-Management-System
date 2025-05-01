import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddProjectMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
