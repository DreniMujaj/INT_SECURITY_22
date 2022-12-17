import {IsEmail, IsString, IsNotEmpty} from 'class-validator';
import {Transform} from 'class-transformer';

/**
 * Login Identify User DTO Class
 */
export class LoginIdentifyUserDto {
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public password!: string;
}
