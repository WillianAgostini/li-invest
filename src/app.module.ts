import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackService } from './feedback/feedback.service';
import { FinanceModule } from './finance/finance.module';
import { SimulationController } from './simulation/simulation.controller';
import { SimulationService } from './simulation/simulation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback/entity/feedback';
import dotenv from 'dotenv';
import { FinancialRate } from './finance/entity/financial-rate';
import { InvestmentController } from './investment/investment.controller';
import { InvestmentService } from './investment/investment.service';
import { Investment } from './investment/entity/investment';
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
      entities: [Feedback, FinancialRate, Investment],
    }),
    TypeOrmModule.forFeature([Feedback, FinancialRate, Investment]),
    FinanceModule,
  ],
  controllers: [SimulationController, FeedbackController, InvestmentController],
  providers: [SimulationService, FeedbackService, InvestmentService],
})
export class AppModule {}
