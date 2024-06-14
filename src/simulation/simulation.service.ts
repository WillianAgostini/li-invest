import { Injectable, Logger } from '@nestjs/common';
import { NewSimulateDto } from './dto/new-simulate-dto';
import { FinanceService } from 'src/finance/finance.service';
import { getDurationInDays } from 'src/utils/conveter';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private financeService: FinanceService) {}

  async getFees() {
    return await this.financeService.getCurrentFees();
  }

  async simulate(newSimulateDto: NewSimulateDto) {
    return await this.financeService.simulate({
      ...newSimulateDto,
      days: getDurationInDays(newSimulateDto.months),
    });
  }
}
