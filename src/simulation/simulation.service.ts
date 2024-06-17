import { Injectable, Logger } from '@nestjs/common';
import { FinanceService } from 'src/finance/finance.service';
import { getDurationInDays } from 'src/utils/conveter';
import { SimulateDto } from './dto/simulate-dto';
import { InvestmentService } from 'src/investment/investment.service';
import { Investment } from 'src/investment/entity/investment';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private financeService: FinanceService,
    private investmentService: InvestmentService,
  ) {}

  async getFees() {
    return await this.financeService.getCurrentFees();
  }

  async simulate(simulateDto: SimulateDto) {
    let productObject: Investment;
    if (simulateDto.productId) {
      productObject = await this.investmentService.getById(simulateDto.productId);
    }
    return await this.financeService.simulate({
      ...simulateDto,
      days: getDurationInDays(simulateDto.months),
      productObject,
    });
  }
}
