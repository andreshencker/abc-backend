import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Property, PropertySchema } from '../property/property.schema';
import { Sale, SaleSchema } from '../sales/sales.schema';
import { Rental, RentalSchema } from '../rental/rental.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Property.name, schema: PropertySchema },
            { name: Sale.name, schema: SaleSchema },
            { name: Rental.name, schema: RentalSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
