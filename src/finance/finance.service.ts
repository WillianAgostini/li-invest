import { Injectable, Logger } from '@nestjs/common';
import { getDurationInDays } from 'src/utils/conveter';
import { clone, isNullOrUndefined } from 'src/utils/util';
import { RateType } from './entity/financial-rate';
import { FeeService } from './fee/fee.service';
import { FinancialRateService } from './financial-rate/financial-rate.service';
import { DetailedValues, Fees } from './interface/fees';
import { CdbSimulateResult, LcxSimulateResult, PoupancaSimulateResult } from './interface/simulate-result';
import { getCDBResult } from './investment/cdb';
import { getLcxResult } from './investment/lcx';
import { getPoupancaResult } from './investment/poupanca';
import { PoupancaSimulateDto, CdbSimulateDto } from 'src/simulation/dto/simulate-dto';

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

  async poupancaSimulate(dto: PoupancaSimulateDto): Promise<PoupancaSimulateResult> {
    const fees = await this.getCurrentFees();
    const poupanca = getPoupancaResult(dto.amount, fees.poupanca.value, getDurationInDays(dto.months));
    return {
      investedAmount: dto.amount,
      periodInMonths: dto.months,
      ...poupanca,
    };
  }

  async cdbSimulate(dto: CdbSimulateDto): Promise<CdbSimulateResult> {
    const fees = await this.getCurrentFees();
    const cdb = getCDBResult(dto.amount, fees.cdi.value, dto.cdiProfiability, getDurationInDays(dto.months));
    return {
      investedAmount: dto.amount,
      periodInMonths: dto.months,
      ...cdb,
    };
  }

  async lcxSimulate(dto: CdbSimulateDto): Promise<LcxSimulateResult> {
    const fees = await this.getCurrentFees();
    const lcx = getLcxResult(dto.amount, fees.cdi.value, dto.cdiProfiability, getDurationInDays(dto.months));
    return {
      investedAmount: dto.amount,
      periodInMonths: dto.months,
      ...lcx,
    };
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
      this.updateRate(RateType.CDI, this.feeService.getSelicOver.bind(this.feeService), financialRate?.cdi),
      this.updateRate(RateType.IPCA, this.feeService.getIpca.bind(this.feeService), financialRate?.ipca),
      this.updateRate(RateType.POUPANCA, this.feeService.getPoupanca.bind(this.feeService), financialRate?.poupanca),
      this.updateRate(RateType.SELIC, this.feeService.getSelicMeta.bind(this.feeService), financialRate?.selic),
      this.updateRate(RateType.TR, this.feeService.getTr.bind(this.feeService), financialRate?.tr),
      this.updateRate(RateType.USD, this.feeService.getDolar.bind(this.feeService), financialRate?.usd),
    ]);

    if (isNullOrUndefined(cdi?.value) || isNullOrUndefined(poupanca?.value)) {
      throw new Error('failed to search fees');
    }

    return {
      cdi,
      ipca,
      poupanca,
      selic,
      tr,
      usd,
    } as Fees;
  }

  async updateRate(rateType: RateType, rateServiceMethod: () => Promise<DetailedValues>, financialRateProperty: any): Promise<DetailedValues | undefined> {
    try {
      const rate = await rateServiceMethod();
      if (isNullOrUndefined(rate?.value) || isNaN(rate?.value)) {
        this.logger.debug(`using cache for ${rateType}`);
        return financialRateProperty?.toDetailedValues();
      }

      await this.financialRateService.insertOrUpdate({
        rate_type: rateType,
        value: rate.value,
        updatedAt: rate.updatedAt,
      });
      return rate;
    } catch (error) {
      this.logger.error(`rateType: ${rateType}`);
      this.logger.error(error);
      return;
    }
  }
}
