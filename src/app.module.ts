import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './auth/auth.guard';
import { DataSourceOrmModule } from './data-source-orm.module';
import { TrackingInterceptor } from './interceptor/tracking.interceptor';
import { Investment } from './investment/entities/investment';
import { InvestmentModule } from './investment/investment.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RealTimeModule } from './real-time/real-time.module';
import { RegulationsModule } from './regulations/regulations.module';
import { FinancialRate } from './simulation/entities/financial-rate';
import { SimulationModule } from './simulation/simulation.module';
import { Track } from './track/entities/track';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    DataSourceOrmModule,
    TypeOrmModule.forFeature([FinancialRate, Investment, Track]),
    SimulationModule,
    RegulationsModule,
    RealTimeModule,
    TrackModule,
    InvestmentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TrackingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
