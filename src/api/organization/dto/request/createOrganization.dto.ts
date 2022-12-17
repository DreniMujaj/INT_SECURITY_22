import {IsNotEmpty, IsString} from 'class-validator';
import {Transform} from 'class-transformer';

/**
 * Create Organization DTO Class
 */
export class CreateOrganizationDto {
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public name!: string;
}
