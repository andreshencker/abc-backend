import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Rental, RentalSchema } from './rental.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Rental.name, schema: RentalSchema }])],
    controllers: [RentalController],
    providers: [RentalService],
    exports: [RentalService],
})
export class RentalModule {}