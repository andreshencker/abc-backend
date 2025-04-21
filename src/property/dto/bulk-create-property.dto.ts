// src/property/dto/bulk-create-property.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { CreatePropertyDto } from './create-property.dto';

export class BulkCreatePropertyDto {
  @ArrayMinSize(1, { message: 'At least one property must be provided.' })
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyDto)
  properties: CreatePropertyDto[];
}
