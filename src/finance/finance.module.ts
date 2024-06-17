import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FeeService } from './fee/fee.service';
import { FinanceService } from './finance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialRate } from './entity/financial-rate';
import { FinancialRateService } from './financial-rate/financial-rate.service';
import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: { rejectUnauthorized: false },
      entities: [FinancialRate],
    }),
    TypeOrmModule.forFeature([FinancialRate]),
    HttpModule,
  ],
  controllers: [],
  providers: [FinanceService, FeeService, FinancialRateService],
  exports: [FinanceService],
})
export class FinanceModule {}
