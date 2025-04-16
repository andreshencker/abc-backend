import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel(Property.name)
        private readonly propertyModel: Model<PropertyDocument>,
    ) {}

    async create(dto: CreatePropertyDto): Promise<Property> {
        try {
            const property = new this.propertyModel(dto);
            return await property.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create property');
        }
    }

    async findAll(): Promise<Property[]> {
        try {
            return await this.propertyModel.find().populate('catID').exec();
        } catch {
            throw new InternalServerErrorException('Failed to fetch properties');
        }
    }

    async findOne(id: string): Promise<Property> {
        try {
            const property = await this.propertyModel.findById(id).populate('catID');
            if (!property) throw new NotFoundException(`Property with ID ${id} not found`);
            return property;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to fetch property');
        }
    }

    async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
        try {
            const updated = await this.propertyModel
                .findByIdAndUpdate(id, dto, { new: true })
                .populate('catID');
            if (!updated) throw new NotFoundException(`Property with ID ${id} not found`);
            return updated;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to update property');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.propertyModel.findByIdAndDelete(id);
            if (!result) throw new NotFoundException(`Property with ID ${id} not found`);
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to delete property');
        }
    }
}