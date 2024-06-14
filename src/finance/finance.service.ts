import { Injectable } from '@nestjs/common';
import { FeeService } from './fee/fee.service';
import { Simulate } from './interface/simulate';
import { getCDBResult } from './investment/cdb';
import { getLcxResult } from './investment/lcx';
import { getPoupancaResult } from './investment/poupanca';
import { StorageService } from './storage/storage.service';
import { SimulateResult } from './interface/simulate-result';
import { Fees } from './interface/fees';

@Injectable()
export class FinanceService {
  constructor(
    private storageService: StorageService,
    private feeService: FeeService,
  ) {}

  async getCurrentFees(): Promise<Fees> {
    let fees = this.storageService.getFees();
    if (!fees) {
      fees = await this.feeService.getAll();
      this.storageService.updateFees(fees);
    }
    return fees;
  }

  async simulate(simulate: Simulate): Promise<SimulateResult> {
    const fees = await this.getCurrentFees();
    const cdb = getCDBResult(simulate.amount, fees.di.value, simulate.cdb, simulate.days);
    const lcx = getLcxResult(simulate.amount, fees.di.value, simulate.lcx, simulate.days);
    const poupanca = getPoupancaResult(simulate.amount, fees.poupanca.value, simulate.days);
    return {
      cdb,
      lcx,
      poupanca,
    };
  }
}
