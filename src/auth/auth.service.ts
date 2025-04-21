import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { comparePasswords, hashPassword } from '../common/utils/hash.util';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {}

    async validateUser(loginDto: LoginDto): Promise<string> {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user || !(await comparePasswords(loginDto.password, user.password))) {
            throw new ConflictException('Invalid email or password');
        }

        const payload = { sub: user._id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }

    async register(registerDto: RegisterDto): Promise<User> {
        try {
            console.log('👉 Payload received:', registerDto); // Log the incoming data

            // Check if a user with the same email already exists
            const existingUser = await this.userModel.findOne({ email: registerDto.email });
            if (existingUser) {
                throw new ConflictException('Email already registered');
            }

            // Hash the password before saving
            const hashed = await hashPassword(registerDto.password);

            // Prepare the user data to be saved
            const userPayload = {
                ...registerDto,
                password: hashed,
                role: registerDto.role || 'customer',
            };

            console.log('🛠 User to be saved:', userPayload); // Log the final user object

            // Save the new user
            const user = new this.userModel(userPayload);
            return await user.save();
        } catch (error) {
            console.error('❌ Error in register:', error); // Log the error for debugging
            if (error.status) throw error; // Re-throw known exceptions
            throw new InternalServerErrorException('Failed to register user'); // Throw general error
        }
    }

    async bulkRegister(users: RegisterDto[]): Promise<User[]> {
        const createdUsers: User[] = [];

        for (const dto of users) {
            try {
                const existingUser = await this.userModel.findOne({ email: dto.email });
                if (existingUser) continue;

                const hashed = await hashPassword(dto.password);
                const user = new this.userModel({
                    ...dto,
                    password: hashed,
                    role: dto.role || 'customer',
                });

                const savedUser = await user.save();
                createdUsers.push(savedUser);
            } catch (error) {
                console.error(`❌ Error creating user ${dto.email}:`, error.message);
            }
        }

        return createdUsers;
    }




    async getProfile(userId: string) {
        return this.userModel.findById(userId).select('-password');
    }

    async forgotPassword({ email }: ForgotPasswordDto): Promise<string> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new ConflictException('Email not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();


        console.log(`Reset password token for ${email}: ${token}`);

        return 'Reset password instructions sent to your email';
    }

    async resetPassword({ token, newPassword }: ResetPasswordDto): Promise<string> {
        const user = await this.userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            throw new ConflictException('Invalid or expired reset token');
        }

        user.password = await hashPassword(newPassword);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return 'Password successfully reset';
    }
}
