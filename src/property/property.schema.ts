import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.schema';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
    @Prop({ required: true })
    propertyName: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ type: String })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    type: string; // e.g., 'house', 'unit'

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    catID: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
