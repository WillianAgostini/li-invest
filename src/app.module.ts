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
      entities: [Feedback, FinancialRate],
    }),
    TypeOrmModule.forFeature([Feedback, FinancialRate]),
    FinanceModule,
  ],
  controllers: [SimulationController, FeedbackController],
  providers: [SimulationService, FeedbackService],
})
export class AppModule {}
