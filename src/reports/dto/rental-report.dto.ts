import { IsOptional, IsString } from 'class-validator';

export class RentalReportDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    customerID?: string;
}