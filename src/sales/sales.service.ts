import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from './sales.schema';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';

@Injectable()
export class SaleService {
    constructor(
        @InjectModel(Sale.name)
        private readonly saleModel: Model<SaleDocument>,
    ) {}

    async create(dto: CreateSaleDto): Promise<Sale> {
        try {
            const sale = new this.saleModel(dto);
            return await sale.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create sale');
        }
    }

    async findAll(): Promise<Sale[]> {
        try {
            return await this.saleModel
                .find()
                .populate('propertyID')
                .populate('customerID')
                .exec();
        } catch {
            throw new InternalServerErrorException('Failed to fetch sales');
        }
    }

    async findOne(id: string): Promise<Sale> {
        try {
            const sale = await this.saleModel
                .findById(id)
                .populate('propertyID')
                .populate('customerID');
            if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
            return sale;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to fetch sale');
        }
    }

    async update(id: string, dto: UpdateSaleDto): Promise<Sale> {
        try {
            const updated = await this.saleModel
                .findByIdAndUpdate(id, dto, { new: true })
                .populate('propertyID')
                .populate('customerID');
            if (!updated) throw new NotFoundException(`Sale with ID ${id} not found`);
            return updated;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to update sale');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.saleModel.findByIdAndDelete(id);
            if (!result) throw new NotFoundException(`Sale with ID ${id} not found`);
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to delete sale');
        }
    }
}