import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRentalDto {
    @IsString()
    @IsNotEmpty()
    propertyID: string;

    @IsString()
    @IsNotEmpty()
    customerID: string;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsNotEmpty()
    paymentType: string;

    @IsString()
    status: string;
}