import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { FinancialRate } from '../entity/financial-rate';

@Injectable()
export class FinancialRateService {
  constructor(
    @InjectRepository(FinancialRate)
    private financialRateRepository: Repository<FinancialRate>,
  ) {}

  async findAll() {
    const financialRate = await this.financialRateRepository.find();
    return {
      cdi: financialRate?.find((x) => x.rate_type == 'cdi'),
      di: financialRate?.find((x) => x.rate_type == 'di'),
      ipca: financialRate?.find((x) => x.rate_type == 'ipca'),
      poupanca: financialRate?.find((x) => x.rate_type == 'poupanca'),
      selic: financialRate?.find((x) => x.rate_type == 'selic'),
      tr: financialRate?.find((x) => x.rate_type == 'tr'),
      usd: financialRate?.find((x) => x.rate_type == 'usd'),
    };
  }

  insertOrUpdate(financialRate: Partial<FinancialRate>): Promise<InsertResult> {
    return this.financialRateRepository.upsert(financialRate, ['rate_type']);
  }
}
