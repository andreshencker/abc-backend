import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale, SaleDocument } from '../sales/sales.schema';
import { Rental, RentalDocument } from '../rental/rental.schema';
import { Model } from 'mongoose';
import { SalesReportDto } from './dto/sales-report.dto';
import { RentalReportDto } from './dto/rental-report.dto';

@Injectable()
export class ReportsService {
    constructor(
      @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
      @InjectModel(Rental.name) private readonly rentalModel: Model<RentalDocument>,
    ) {}

    async generateSalesReport(filters: SalesReportDto) {
        const query: any = {};

        if (filters.startDate && filters.endDate) {
            query.date = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }

        if (filters.customerID) {
            query.customerID = filters.customerID;
        }

        if (filters.propertyID) {
            query.propertyID = filters.propertyID;
        }

        return await this.saleModel
          .find(query)
          .populate('customerID')
          .populate('propertyID');
    }

    async generateRentalReport(filters: RentalReportDto) {
        const query: any = {};

        if (filters.startDate && filters.endDate) {
            query.date = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }

        if (filters.customerID) {
            query.customerID = filters.customerID;
        }

        if (filters.propertyID) {
            query.propertyID = filters.propertyID;
        }

        return await this.rentalModel
          .find(query)
          .populate('customerID')
          .populate('propertyID');
    }
}
