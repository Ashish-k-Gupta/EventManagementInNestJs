import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
