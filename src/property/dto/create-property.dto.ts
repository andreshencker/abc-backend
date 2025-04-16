import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePropertyDto {
    @IsString()
    @IsNotEmpty()
    propertyName: string;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    catID: string; // reference to Category
}