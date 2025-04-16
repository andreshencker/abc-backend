import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


import { validationSchema } from './config/env.validation';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { PropertyModule } from './property/property.module';
import { SaleModule } from './sales/sales.module';
import { RentalModule } from './rental/rental.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('❌ MONGO_URI is not defined in .env');
        }

        return {
          uri,
          dbName: 'abc_property_db',
        };
      },
    }),
    UserModule,
    AuthModule,
    CustomerModule,
    CategoryModule,
    PropertyModule,
    SaleModule,
    RentalModule,
    DashboardModule,
    ReportsModule,
    AdminModule,
  ],
})
export class AppModule {}