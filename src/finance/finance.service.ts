import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { clone, isNullOrUndefined } from 'src/utils/util';
import { FeeService } from './fee/fee.service';
import { FinancialRateService } from './financial-rate/financial-rate.service';
import { DetailedValues, Fees } from './interface/fees';
import { Simulate } from './interface/simulate';
import { SimulateResult } from './interface/simulate-result';
import { getCDBResult } from './investment/cdb';
import { getLcxResult } from './investment/lcx';
import { getPoupancaResult } from './investment/poupanca';
import { RateType } from './entity/financial-rate';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  private cache: Fees | undefined;

  constructor(
    private feeService: FeeService,
    private financialRateService: FinancialRateService,
  ) {
    const oneHour = 60 * 60 * 1000;
    setInterval(this.clearFees, oneHour);
  }

  clearFees() {
    this.cache = undefined;
  }

  async simulate(simulate: Simulate) {
    const fees = await this.getCurrentFees();
    const response = {
      investedAmount: simulate.amount,
      periodInMonths: simulate.months,
    };

    if (simulate.productObject?.id && simulate.productObject.profitabilityType == 'CDI') {
      if (simulate.months > simulate.productObject.getMonthsUntilMaturity() + 1) {
        throw new BadRequestException('Data da simulação não pode ser maior que a data final do investimento');
      }

      if (simulate.productObject.type == 'CDB') {
        const rentabilidadeCdb = Number(simulate.productObject.profitability);
        return {
          ...response,
          cdb: getCDBResult(simulate.amount, fees.cdi.value, rentabilidadeCdb, simulate.days),
        } as SimulateResult;
      }
      if (simulate.productObject.type == 'LCI' || simulate.productObject.type == 'LCA') {
        const rentabilidadeLcx = Number(simulate.productObject.profitability);
        return {
          ...response,
          lcx: getLcxResult(simulate.amount, fees.cdi.value, rentabilidadeLcx, simulate.days),
        } as SimulateResult;
      }

      throw new BadRequestException('Esse investimento não pode ser simulado ainda');
    }

    if (!isNullOrUndefined(simulate.cdb) && isNullOrUndefined(simulate.lcx)) {
      return {
        ...response,
        cdb: getCDBResult(simulate.amount, fees.cdi.value, simulate.cdb, simulate.days),
      } as SimulateResult;
    }

    if (isNullOrUndefined(simulate.cdb) && !isNullOrUndefined(simulate.lcx)) {
      return {
        ...response,
        lcx: getLcxResult(simulate.amount, fees.cdi.value, simulate.lcx, simulate.days),
      } as SimulateResult;
    }

    return {
      ...response,
      poupanca: getPoupancaResult(simulate.amount, fees.poupanca.value, simulate.days),
      cdb: getCDBResult(simulate.amount, fees.cdi.value, simulate.cdb ?? fees.rentabilidadeCdb, simulate.days),
      lcx: getLcxResult(simulate.amount, fees.cdi.value, simulate.lcx ?? fees.rentabilidadeLcx, simulate.days),
    } as SimulateResult;
  }

  async getCurrentFees() {
    if (!this.cache) {
      const fees = await this.fetchAndUpdateRates();
      this.cache = fees;
    }

    this.cache.rentabilidadeCdb = parseFloat(process.env.RENTABILIDADE_CDB) || 100;
    this.cache.rentabilidadeLcx = parseFloat(process.env.RENTABILIDADE_LCX) || 100;
    return clone(this.cache);
  }

  private async fetchAndUpdateRates() {
    this.logger.debug('fetchAndUpdateRates');

    const financialRate = await this.financialRateService.findAll();
    const [cdi, ipca, poupanca, selic, tr, usd] = await Promise.all([
      this.updateRate(RateType.CDI, this.feeService.getSelicOver, financialRate?.cdi),
      this.updateRate(RateType.IPCA, this.feeService.getIpca, financialRate?.ipca),
      this.updateRate(RateType.POUPANCA, this.feeService.getPoupanca, financialRate?.poupanca),
      this.updateRate(RateType.SELIC, this.feeService.getSelicMeta, financialRate?.selic),
      this.updateRate(RateType.TR, this.feeService.getTr, financialRate?.tr),
      this.updateRate(RateType.USD, this.feeService.getDolar, financialRate?.usd),
    ]);

    const fees = {
      cdi,
      ipca,
      poupanca,
      selic,
      tr,
      usd,
    } as Fees;

    this.validateIsNull(fees);
    return fees;
  }

  async updateRate(rateType: RateType, rateServiceMethod: () => Promise<DetailedValues>, financialRateProperty: any) {
    const rate = await rateServiceMethod();
    if (isNullOrUndefined(rate?.value)) {
      return financialRateProperty?.toDetailedValues();
    }

    await this.financialRateService.insertOrUpdate({
      rate_type: rateType,
      value: rate.value,
      updatedAt: rate.updatedAt,
    });
    return rate;
  }

  private validateIsNull(fees: Fees) {
    const hasNullOrUndefinedValues = Object.values(fees).filter((x) => isNullOrUndefined(x?.value));
    if (hasNullOrUndefinedValues.length) {
      throw new Error('failed to search fees');
    }
  }
}
