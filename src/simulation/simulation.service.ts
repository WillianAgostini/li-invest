import { Injectable, Logger } from '@nestjs/common';
import { FinanceService } from 'src/finance/finance.service';
import { getDurationInDays } from 'src/utils/conveter';
import { SimulateDto } from './dto/simulate-dto';
import { isNullOrUndefined } from 'src/utils/util';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private financeService: FinanceService) {}

  async getFees() {
    return await this.financeService.getCurrentFees();
  }

  async simulate(simulateDto: SimulateDto) {
    simulateDto.cdb = !isNullOrUndefined(simulateDto.cdb) ? simulateDto.cdb : 100;
    simulateDto.lcx = !isNullOrUndefined(simulateDto.lcx) ? simulateDto.lcx : 100;
    return await this.financeService.simulate({
      ...simulateDto,
      days: getDurationInDays(simulateDto.months),
    });
  }
}
