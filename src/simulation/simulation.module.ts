import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SimulationController } from './controllers/simulation.controller';
import { FinancialRateRepository } from './repositories/financial-rate.repository';
import { FeeService } from './services/fee.service';
import { FinanceService } from './services/finance.service';
import { SimulationService } from './services/simulation.service';

@Module({
  imports: [HttpModule],
  controllers: [SimulationController],
  providers: [FinanceService, FeeService, FinancialRateRepository, SimulationService],
  exports: [SimulationService],
})
export class SimulationModule {}
