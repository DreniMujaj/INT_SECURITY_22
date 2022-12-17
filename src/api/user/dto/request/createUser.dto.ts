import {IsEmail, IsArray, IsString, IsOptional, IsEnum, ArrayUnique, IsNotEmpty, ArrayNotEmpty} from 'class-validator';
import {Transform} from 'class-transformer';
import {Role} from '../../../../auth/@types/roles';

/**
 * Create User DTO Class
 */
export class CreateUserDto {
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(Role, {each: true})
  public roles!: Role[];

  @IsOptional()
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public organization?: string;
}
