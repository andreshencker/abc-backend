import {
    Controller,
    Post,
    Get,
    Body,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SalesReportDto } from './dto/sales-report.dto';
import { RentalReportDto } from './dto/rental-report.dto';
import { generatePDF } from './utils/pdf-generator';
import { generateExcel } from './utils/excel-generator';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post('sales')
    async getSalesReport(@Body() dto: SalesReportDto) {
        try {
            const data = await this.reportsService.generateSalesReport(dto);
            return { message: 'Sales report generated successfully', data };
        } catch (error) {
            throw new HttpException(
              error.message || 'Failed to generate sales report',
              error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('rentals')
    async getRentalReport(@Body() dto: RentalReportDto) {
        try {
            const data = await this.reportsService.generateRentalReport(dto);
            return { message: 'Rental report generated successfully', data };
        } catch (error) {
            throw new HttpException(
              error.message || 'Failed to generate rental report',
              error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('sales/pdf')
    async exportSalesPDF(@Res() res: Response) {
        try {
            const sales = await this.reportsService.generateSalesReport({});
            if (!sales.length) {
                return res.status(400).send('No sales data available for export.');
            }

            const buffer = await generatePDF(sales, 'Sales Report');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
              'Content-Disposition',
              'attachment; filename="sales-report.pdf"',
            );
            return res.send(buffer);
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            throw new HttpException(
              error.message || 'Failed to generate PDF',
              error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    @Get('sales/excel')
    async exportSalesExcel(@Res() res: Response) {
        try {
            const sales = await this.reportsService.generateSalesReport({});
            const buffer = await generateExcel(sales, 'Sales Report');
            res.setHeader(
              'Content-Type',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            res.setHeader(
              'Content-Disposition',
              'attachment; filename="sales-report.xlsx"',
            );
            return res.send(buffer);
        } catch (error) {
            throw new HttpException(
              error.message || 'Failed to generate Excel',
              error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
