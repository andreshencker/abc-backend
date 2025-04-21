import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from '../property/property.schema';
import { Sale, SaleDocument } from '../sales/sales.schema';
import { Rental, RentalDocument } from '../rental/rental.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class DashboardService {
    constructor(
      @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
      @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
      @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
      @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    private getMonthName(monthNumber: number): string {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        return monthNames[monthNumber - 1] || 'Unknown';
    }

    async getSummary() {
        const [totalProperties, totalSales, totalRentals, totalCustomers] = await Promise.all([
            this.propertyModel.countDocuments(),
            this.saleModel.countDocuments(),
            this.rentalModel.countDocuments(),
            this.userModel.countDocuments(),
        ]);

        const monthlySalesRaw = await this.saleModel.aggregate([
            {
                $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 },
                    total: { $sum: '$price' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const monthlyRentalsRaw = await this.rentalModel.aggregate([
            {
                $group: {
                    _id: { $month: '$date' },
                    count: { $sum: 1 },
                    total: { $sum: '$price' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const monthlySales = monthlySalesRaw.map((entry) => ({
            month: this.getMonthName(entry._id),
            count: entry.count,
            total: entry.total,
        }));

        const monthlyRentals = monthlyRentalsRaw.map((entry) => ({
            month: this.getMonthName(entry._id),
            count: entry.count,
            total: entry.total,
        }));

        return {
            totalProperties,
            totalSales,
            totalRentals,
            totalCustomers,
            monthlySales,
            monthlyRentals,
        };
    }
}

