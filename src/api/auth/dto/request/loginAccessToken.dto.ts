import {IsString, IsNotEmpty} from 'class-validator';
import {Transform} from 'class-transformer';

/**
 * Login Access Token DTO Class
 */
export class LoginAccessToken {
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public accessToken!: string;
}
