import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
    @Prop({ required: true })
    customerName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    mobile: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);