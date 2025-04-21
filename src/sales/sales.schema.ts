import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Property } from '../property/property.schema';
import { User } from '../users/user.schema';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
    @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
    propertyID: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    customerID: Types.ObjectId;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 'pending' })
    status: string; // Example: 'pending', 'approved', 'rejected'
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
