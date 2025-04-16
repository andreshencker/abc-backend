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
            const existingUser = await this.userModel.findOne({ email: registerDto.email });
            if (existingUser) {
                throw new ConflictException('Email already registered');
            }

            const hashed = await hashPassword(registerDto.password);
            const user = new this.userModel({
                ...registerDto,
                password: hashed,
                role: registerDto.role || 'customer',
            });

            return await user.save();
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to register user');
        }
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
