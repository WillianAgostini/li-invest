import { Injectable, Logger } from '@nestjs/common';
import { CdbSimulateDto } from 'src/simulation/dto/simulate-dto';
import { getDurationInDays } from 'src/utils/conveter';
import { getCDBResult } from '../core/cdb';
import { getLcxResult } from '../core/lcx';
import { RateType } from '../entities/financial-rate';
import { Fees } from '../interface/fees';
import { CdbSimulateResult, LcxSimulateResult } from '../interface/simulate-result';
import { FinancialRateRepository } from '../repositories/financial-rate.repository';
import { FeeService } from './fee.service';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    private feeService: FeeService,
    private financialRateService: FinancialRateRepository,
  ) { }

  async clearFees() {
    for (const rateType of Object.values(RateType)) {
      await this.financialRateService.delete(rateType);
    }
  }

  async cdbSimulate(dto: CdbSimulateDto): Promise<CdbSimulateResult> {
    const fees = await this.getCurrentFees();
    const cdb = getCDBResult(dto.amount, fees.cdi.value, dto.cdiProfiability || fees.rentabilidadeCdb, getDurationInDays(dto.months));
    return {
      investedAmount: dto.amount,
      periodInMonths: dto.months,
      ...cdb,
    };
  }

  async lcxSimulate(dto: CdbSimulateDto): Promise<LcxSimulateResult> {
    const fees = await this.getCurrentFees();
    const lcx = getLcxResult(dto.amount, fees.cdi.value, dto.cdiProfiability || fees.rentabilidadeLcx, getDurationInDays(dto.months));
    return {
      investedAmount: dto.amount,
      periodInMonths: dto.months,
      ...lcx,
    };
  }

  async getCurrentFees() {
    const fees = {
      rentabilidadeCdb: parseFloat(process.env.RENTABILIDADE_CDB) || 100,
      rentabilidadeLcx: parseFloat(process.env.RENTABILIDADE_LCX) || 100,
    } as Fees;
    const operations = {
      cdi: () => this.feeService.getSelicOver(),
      ipca: () => this.feeService.getIpca(),
      selic: () => this.feeService.getSelicMeta(),
      usd: () => this.feeService.getDolar(),
    }

    for (const rateType of Object.values(RateType)) {
      let financialRate = await this.financialRateService.find(rateType);
      if (!financialRate) {
        financialRate = await operations[rateType]();
      }
      fees[rateType] = financialRate;
    }

    return fees;
  }

}
