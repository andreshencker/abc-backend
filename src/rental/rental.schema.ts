import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Property } from '../property/property.schema';
import { Customer } from '../customer/customer.schema';

export type RentalDocument = Rental & Document;

@Schema({ timestamps: true })
export class Rental {
    @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
    propertyID: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customerID: Types.ObjectId;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    paymentType: string; // e.g. 'credit card', 'cash', 'bank transfer'

    @Prop({ default: 'pending' })
    status: string; // e.g. 'pending', 'active', 'completed'
}

export const RentalSchema = SchemaFactory.createForClass(Rental);
