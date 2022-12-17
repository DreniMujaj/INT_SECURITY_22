import {IsObject, ValidateNested, IsOptional} from 'class-validator';
import {Type} from 'class-transformer';
import {LoginIdentifyUserDto} from './loginIdentifyUser.dto';
import {LoginAccessToken} from './loginAccessToken.dto';

/**
 * Login User DTO Class
 */
export class LoginUserDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LoginIdentifyUserDto)
  public localUser?: LoginIdentifyUserDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LoginAccessToken)
  public tokenUser?: LoginAccessToken;
}
