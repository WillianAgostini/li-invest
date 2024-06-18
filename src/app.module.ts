import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { AuthGuard } from './auth/auth.guard';
import { Feedback } from './feedback/entity/feedback';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackService } from './feedback/feedback.service';
import { FinancialRate } from './finance/entity/financial-rate';
import { FinanceModule } from './finance/finance.module';
import { Investment } from './investment/entity/investment';
import { InvestmentController } from './investment/investment.controller';
import { InvestmentService } from './investment/investment.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RealTimeController } from './real-time/real-time.controller';
import { RegulationsController } from './regulations/regulations.controller';
import { SimulationController } from './simulation/simulation.controller';
import { SimulationService } from './simulation/simulation.service';
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
  controllers: [SimulationController, FeedbackController, InvestmentController, RegulationsController, RealTimeController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    SimulationService,
    FeedbackService,
    InvestmentService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
