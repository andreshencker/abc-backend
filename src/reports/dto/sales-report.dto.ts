import { IsOptional, IsString } from 'class-validator';

export class SalesReportDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    customerID?: string;

    @IsOptional()
    @IsString()
    propertyID?: string;
}
