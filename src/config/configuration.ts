import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('❌ MONGO_URI is not defined in your .env file');
}

export const mongoConfig: MongooseModuleOptions = {
    uri: process.env.MONGO_URI,
};