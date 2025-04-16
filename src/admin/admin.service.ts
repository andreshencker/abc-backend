import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAllStaff(): Promise<User[]> {
        return this.userModel.find({ role: { $ne: 'customer' } }).select('-password');
    }

    async updateRole(userId: string, role: string): Promise<User> {
        const updated = await this.userModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true },
        ).select('-password');

        if (!updated) throw new NotFoundException(`User with ID ${userId} not found`);
        return updated;
    }

    async toggleActive(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

        user.isActive = !user.isActive;
        await user.save();
        return user;
    }
}