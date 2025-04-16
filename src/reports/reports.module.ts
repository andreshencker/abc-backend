import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from '../sales/sales.schema';
import { Rental, RentalSchema } from '../rental/rental.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Sale.name, schema: SaleSchema },
            { name: Rental.name, schema: RentalSchema },
        ]),
    ],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}