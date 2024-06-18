import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { clone, isNullOrUndefined } from 'src/utils/util';
import { FeeService } from './fee/fee.service';
import { FinancialRateService } from './financial-rate/financial-rate.service';
import { Fees } from './interface/fees';
import { Simulate } from './interface/simulate';
import { SimulateResult } from './interface/simulate-result';
import { getCDBResult } from './investment/cdb';
import { getLcxResult } from './investment/lcx';
import { getPoupancaResult } from './investment/poupanca';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  private cache: Fees | undefined;

  constructor(
    private feeService: FeeService,
    private financialRateService: FinancialRateService,
  ) {
    setInterval(this.clearFees, 21600000); // 21.600.000 milissegundos = 6 hours
  }

  async simulate(simulate: Simulate) {
    const fees = await this.getCurrentFees();
    const response = {
      investedAmount: simulate.amount,
      periodInMonths: simulate.months,
    };

    if (simulate.productObject?.id && simulate.productObject.profitabilityType == 'CDI') {
      if (simulate.days > simulate.productObject.getDaysUntilMaturity() + 31) {
        throw new BadRequestException('Data da simulação não pode ser maior que a data final do investimento');
      }

      if (simulate.productObject.type == 'CDB') {
        const rentabilidadeCdb = Number(simulate.productObject.profitability);
        return {
          ...response,
          cdb: getCDBResult(simulate.amount, fees.di.value, rentabilidadeCdb, simulate.days),
        } as SimulateResult;
      }
      if (simulate.productObject.type == 'LCI' || simulate.productObject.type == 'LCA') {
        const rentabilidadeLcx = Number(simulate.productObject.profitability);
        return {
          ...response,
          lcx: getLcxResult(simulate.amount, fees.di.value, rentabilidadeLcx, simulate.days),
        } as SimulateResult;
      }

      throw new BadRequestException('Esse investimento não pode ser simulado ainda');
    }

    if (!isNullOrUndefined(simulate.cdb) && isNullOrUndefined(simulate.lcx)) {
      return {
        ...response,
        cdb: getCDBResult(simulate.amount, fees.di.value, simulate.cdb, simulate.days),
      } as SimulateResult;
    }

    if (isNullOrUndefined(simulate.cdb) && !isNullOrUndefined(simulate.lcx)) {
      return {
        ...response,
        lcx: getLcxResult(simulate.amount, fees.di.value, simulate.lcx, simulate.days),
      } as SimulateResult;
    }

    return {
      ...response,
      poupanca: getPoupancaResult(simulate.amount, fees.poupanca.value, simulate.days),
      cdb: getCDBResult(simulate.amount, fees.di.value, simulate.cdb ?? fees.rentabilidadeCdb, simulate.days),
      lcx: getLcxResult(simulate.amount, fees.di.value, simulate.lcx ?? fees.rentabilidadeLcx, simulate.days),
    } as SimulateResult;
  }

  async getCurrentFees() {
    return this.getAll();
  }

  private clearFees() {
    this.cache = undefined;
  }

  async getAll() {
    if (!this.cache) {
      const fees = await this.fetchAndUpdateRates();
      this.validateIsNull(fees);
      this.cache = fees;
    }

    this.cache.rentabilidadeCdb = parseFloat(process.env.RENTABILIDADE_CDB) || 100;
    this.cache.rentabilidadeLcx = parseFloat(process.env.RENTABILIDADE_LCX) || 100;
    return clone(this.cache);
  }

  private async fetchAndUpdateRates() {
    this.logger.debug('fetchAndUpdateRates');
    // eslint-disable-next-line prefer-const
    let [di, tr, cdi, ipca, selic, poupanca, financialRate] = await Promise.all([
      this.feeService.getSelicOver(),
      this.feeService.getTr(),
      this.feeService.getCdi(),
      this.feeService.getIpca(),
      this.feeService.getSelicMeta(),
      this.feeService.getPoupanca(),
      this.financialRateService.findAll(),
    ]);

    const promisesInsert: Promise<any>[] = [];
    if (isNullOrUndefined(cdi.value)) {
      cdi = financialRate.cdi?.toDetailedValues();
    } else {
      promisesInsert.push(
        this.financialRateService.insertOrUpdate({
          rate_type: 'cdi',
          value: cdi.value,
          updatedAt: cdi.updatedAt,
        }),
      );
    }

    if (isNullOrUndefined(di.value)) {
      di = financialRate.di?.toDetailedValues();
    } else {
      promisesInsert.push(
        this.financialRateService.insertOrUpdate({
          rate_type: 'di',
          value: di.value,
          updatedAt: di.updatedAt,
        }),
      );
    }

    if (isNullOrUndefined(ipca.value)) {
      ipca = financialRate.ipca?.toDetailedValues();
    } else {
      promisesInsert.push(
        this.financialRateService.insertOrUpdate({
          rate_type: 'ipca',
          value: ipca.value,
          updatedAt: ipca.updatedAt,
        }),
      );
    }

    if (isNullOrUndefined(poupanca.value)) {
      poupanca = financialRate.poupanca?.toDetailedValues();
    } else {
      promisesInsert.push(
        this.financialRateService.insertOrUpdate({
          rate_type: 'poupanca',
          value: poupanca.value,
          updatedAt: poupanca.updatedAt,
        }),
      );
    }

    if (isNullOrUndefined(selic.value)) {
      selic = financialRate.selic?.toDetailedValues();
    } else {
      promisesInsert.push(
        this.financialRateService.insertOrUpdate({
          rate_type: 'selic',
          value: selic.value,
          updatedAt: selic.updatedAt,
        }),
      );
    }

    if (isNullOrUndefined(tr.value)) {
      tr = financialRate.tr?.toDetailedValues();
    } else {
      promisesInsert.push(
        this.financialRateService.insertOrUpdate({
          rate_type: 'tr',
          value: tr.value,
          updatedAt: tr.updatedAt,
        }),
      );
    }

    await Promise.all(promisesInsert);
    return {
      cdi,
      di,
      ipca,
      poupanca,
      selic,
      tr,
    } as Fees;
  }

  private validateIsNull(fees: Fees) {
    if (
      isNullOrUndefined(fees.cdi.value) ||
      isNullOrUndefined(fees.di.value) ||
      isNullOrUndefined(fees.ipca.value) ||
      isNullOrUndefined(fees.poupanca.value) ||
      isNullOrUndefined(fees.selic.value) ||
      isNullOrUndefined(fees.tr.value)
    ) {
      throw new Error('failed to search fees');
    }
  }
}
