import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationController } from './controllers/simulation.controller';
import { FinancialRate } from './entities/financial-rate';
import { FinancialRateRepository } from './repositories/financial-rate.repository';
import { FeeService } from './services/fee.service';
import { FinanceService } from './services/finance.service';
import { SimulationService } from './services/simulation.service';
import { InvestmentModule } from 'src/investment/investment.module';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialRate]), HttpModule, InvestmentModule],
  controllers: [SimulationController],
  providers: [FinanceService, FeeService, FinancialRateRepository, SimulationService],
  exports: [SimulationService],
})
export class SimulationModule {}
