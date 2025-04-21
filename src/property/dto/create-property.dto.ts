import { IsString, IsNotEmpty, IsArray, IsNumber, IsMongoId, IsOptional, IsEnum } from 'class-validator';
import { PropertyType } from '../property.schema';
import { Transform } from 'class-transformer';

export class CreatePropertyDto {
    @IsString()
    @IsNotEmpty()
    propertyName: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsEnum(PropertyType)
    @IsNotEmpty()
    type: PropertyType;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    hasParking?: number;

    @IsNumber()
    @IsOptional()
    bedrooms?: number;

    @IsMongoId()
    @IsNotEmpty()
    catID: string;
}

