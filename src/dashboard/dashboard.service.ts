import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from '../property/property.schema';
import { Sale, SaleDocument } from '../sales/sales.schema';
import { Rental, RentalDocument } from '../rental/rental.schema';
import { Customer, CustomerDocument } from '../customer/customer.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
        @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
        @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    ) {}

    async getSummary() {
        const [totalProperties, totalSales, totalRentals, totalCustomers] = await Promise.all([
            this.propertyModel.countDocuments(),
            this.saleModel.countDocuments(),
            this.rentalModel.countDocuments(),
            this.customerModel.countDocuments(),
        ]);

        const monthlySales = await this.saleModel.aggregate([
            {
                $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 },
                    total: { $sum: '$price' },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        return {
            totalProperties,
            totalSales,
            totalRentals,
            totalCustomers,
            monthlySales,
        };
    }
}