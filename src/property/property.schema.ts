import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PropertyDocument = Property & Document;

export enum PropertyType {
    HOUSE = 'house',
    APARTMENT = 'apartment',
    STUDIO = 'studio',
    UNIT = 'unit',
    VILLA = 'villa',
}

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

    @Prop({ required: true, enum: PropertyType })
    type: PropertyType;

    @Prop()
    address: string;

    @Prop({ default: false })
    hasParking: number;

    @Prop({ default: 1 })
    bedrooms: number;



    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    catID: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

