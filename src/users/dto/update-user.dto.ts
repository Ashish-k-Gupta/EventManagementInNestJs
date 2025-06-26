import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRoles } from "src/common/enums/userRole.enum";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
