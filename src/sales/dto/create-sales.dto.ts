import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSaleDto {
    @IsString()
    @IsNotEmpty()
    propertyID: string;

    @IsString()
    @IsNotEmpty()
    customerID: string;

    @IsString()
    @IsNotEmpty()
    date: string; // ISO string

    @IsNumber()
    price: number;

    @IsString()
    status: string;
}