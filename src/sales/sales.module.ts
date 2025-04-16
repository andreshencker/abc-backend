import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleService } from './sales.service';
import { SaleController } from './sales.controller';
import { Sale, SaleSchema } from './sales.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }])],
    controllers: [SaleController],
    providers: [SaleService],
    exports: [SaleService],
})
export class SaleModule {}