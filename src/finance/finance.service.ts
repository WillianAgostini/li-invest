import { Injectable } from '@nestjs/common';
import { Simulate } from './interface/simulate';
import { StorageService } from './storage/storage.service';
import { FeeService } from './fee/fee.service';
import { getCDBResult } from './investment/cdb';
import { getLcxResult } from './investment/lcx';
import { getPoupancaResult } from './investment/poupanca';

@Injectable()
export class FinanceService {
  constructor(
    private storageService: StorageService,
    private feeService: FeeService,
  ) {}

  async getCurrentFees() {
    let fees = this.storageService.getFees();
    if (!fees) {
      fees = await this.feeService.getAll();
      this.storageService.updateFees(fees);
    }
    return fees;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async simulate(simulate: Simulate) {
    const fees = await this.getCurrentFees();
    const cdb = getCDBResult(simulate.amount, fees.di.value, simulate.cdb, simulate.days);
    const lcx = getLcxResult(simulate.amount, fees.di.value, simulate.lcx, simulate.days);
    const poupanca = getPoupancaResult(simulate.amount, fees.poupanca.value, simulate.days);
    return {
      investedAmount: simulate.amount,
      cdb,
      lcx,
      poupanca,
    };
  }
}
