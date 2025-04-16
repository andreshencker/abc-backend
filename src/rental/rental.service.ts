import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental, RentalDocument } from './rental.schema';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalService {
    constructor(
        @InjectModel(Rental.name)
        private readonly rentalModel: Model<RentalDocument>,
    ) {}

    async create(dto: CreateRentalDto): Promise<Rental> {
        try {
            const rental = new this.rentalModel(dto);
            return await rental.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create rental');
        }
    }

    async findAll(): Promise<Rental[]> {
        try {
            return await this.rentalModel
                .find()
                .populate('propertyID')
                .populate('customerID')
                .exec();
        } catch {
            throw new InternalServerErrorException('Failed to fetch rentals');
        }
    }

    async findOne(id: string): Promise<Rental> {
        try {
            const rental = await this.rentalModel
                .findById(id)
                .populate('propertyID')
                .populate('customerID');
            if (!rental) throw new NotFoundException(`Rental with ID ${id} not found`);
            return rental;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to fetch rental');
        }
    }

    async update(id: string, dto: UpdateRentalDto): Promise<Rental> {
        try {
            const updated = await this.rentalModel
                .findByIdAndUpdate(id, dto, { new: true })
                .populate('propertyID')
                .populate('customerID');
            if (!updated) throw new NotFoundException(`Rental with ID ${id} not found`);
            return updated;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to update rental');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.rentalModel.findByIdAndDelete(id);
            if (!result) throw new NotFoundException(`Rental with ID ${id} not found`);
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to delete rental');
        }
    }
}