import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRoles } from "src/common/enums/userRole.enum";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @IsEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  @IsEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoles)
  @IsNotEmpty()
  role: UserRoles;
}
