import {Transform} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

/**
 * Update Organization DTO Class
 */
export class UpdateOrganizationDto {
  @IsOptional()
  @Transform(({value}: any) => value?.trim())
  @IsNotEmpty()
  @IsString()
  public name?: string;
}
