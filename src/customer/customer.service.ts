import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { hashPassword } from '../common/utils/hash.util';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name)
        private readonly customerModel: Model<CustomerDocument>,
    ) {}

    async create(dto: CreateCustomerDto): Promise<Customer> {
        try {
            const exists = await this.customerModel.findOne({ email: dto.email });
            if (exists) throw new ConflictException('Email already registered');

            const hashed = await hashPassword(dto.password);
            const customer = new this.customerModel({
                ...dto,
                password: hashed,
            });

            return await customer.save();
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to create customer');
        }
    }

    async findAll(): Promise<Customer[]> {
        try {
            return this.customerModel.find().select('-password').exec();
        } catch {
            throw new InternalServerErrorException('Failed to fetch customers');
        }
    }

    async findOne(id: string): Promise<Customer> {
        try {
            const customer = await this.customerModel.findById(id).select('-password');
            if (!customer) throw new NotFoundException(`Customer with ID ${id} not found`);
            return customer;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to fetch customer');
        }
    }

    async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
        try {
            if (dto.password) {
                dto.password = await hashPassword(dto.password);
            }

            const updated = await this.customerModel
                .findByIdAndUpdate(id, dto, { new: true })
                .select('-password');

            if (!updated) throw new NotFoundException(`Customer with ID ${id} not found`);
            return updated;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to update customer');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.customerModel.findByIdAndDelete(id);
            if (!result) throw new NotFoundException(`Customer with ID ${id} not found`);
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to delete customer');
        }
    }
}