import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'staff', enum: ['admin', 'manager', 'accountant', 'staff', 'maintenance', 'secretary'] })
    role: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);