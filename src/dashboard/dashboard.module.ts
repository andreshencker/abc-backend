import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from '../property/property.schema';
import { Sale, SaleSchema } from '../sales/sales.schema';
import { Rental, RentalSchema } from '../rental/rental.schema';
import { Customer, CustomerSchema } from '../customer/customer.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Property.name, schema: PropertySchema },
            { name: Sale.name, schema: SaleSchema },
            { name: Rental.name, schema: RentalSchema },
            { name: Customer.name, schema: CustomerSchema },
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}