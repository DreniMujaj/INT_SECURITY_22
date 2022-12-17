import {IsEmail, IsArray, IsString, IsOptional, IsEnum, ArrayUnique, IsNotEmpty} from 'class-validator';
import {Role} from '../../../../auth/@types/roles';
import {Transform} from 'class-transformer';

/**
 * Update User DTO Class
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @Transform(({value}: any) => value?.trim())
  public email?: string;

  @IsOptional()
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public password?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Role, {each: true})
  public roles?: Role[];

  @IsOptional()
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public organization?: string;
}
