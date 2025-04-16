import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const newUser = new this.userModel({
                ...createUserDto,
                password: hashedPassword,
            });
            return await newUser.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel.find().select('-password').exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userModel.findById(id).select('-password');
            if (!user) throw new NotFoundException(`User with ID ${id} not found`);
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }
            const updated = await this.userModel
                .findByIdAndUpdate(id, updateUserDto, { new: true })
                .select('-password');

            if (!updated) throw new NotFoundException(`User with ID ${id} not found`);
            return updated;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.userModel.findByIdAndDelete(id);
            if (!result) throw new NotFoundException(`User with ID ${id} not found`);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to delete user');
        }
    }
}