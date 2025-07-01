import { Injectable } from '@nestjs/common';
import { Fees } from 'src/simulation/interface/fees';
import { CdbSimulateResult, LcxSimulateResult } from 'src/simulation/interface/simulate-result';
import { FinanceService } from 'src/simulation/services/finance.service';
import { CdbSimulateDto, LcxSimulateDto } from '../dto/simulate-dto';

@Injectable()
export class SimulationService {

  constructor(
    private financeService: FinanceService,
  ) { }

  getFees(): Promise<Fees> {
    return this.financeService.getCurrentFees();
  }

  clear(): Promise<void> {
    return this.financeService.clearFees();
  }

  cdbSimulate(dto: CdbSimulateDto): Promise<CdbSimulateResult> {
    return this.financeService.cdbSimulate(dto);
  }

  lcxSimulate(dto: LcxSimulateDto): Promise<LcxSimulateResult> {
    return this.financeService.lcxSimulate(dto);
  }
}
