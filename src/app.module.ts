import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { mongoConfig } from './config/configuration';
import { validationSchema } from './config/env.validation';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
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
    MongooseModule.forRoot(mongoConfig.uri!, {
      dbName: mongoConfig.dbName,
    }),
    UserModule,
    AuthModule,
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