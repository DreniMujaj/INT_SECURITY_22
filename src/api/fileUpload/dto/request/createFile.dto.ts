import {IsMongoId} from 'class-validator';

/**
 * CreateFileDTO
 *
 */
export class CreateFileDTO {
    @IsMongoId()
      userId!: string;
}