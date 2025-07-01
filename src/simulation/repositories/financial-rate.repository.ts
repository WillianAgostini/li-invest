import { Inject, Injectable } from '@nestjs/common';
import { FinancialRate, RateType } from '../entities/financial-rate';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export interface IFinancialRate {
  cdi: FinancialRate;
  ipca: FinancialRate;
  selic: FinancialRate;
  usd: FinancialRate;
}

@Injectable()
export class FinancialRateRepository {

  private readonly cacheKey = 'financialRates';
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async find(rate_type: RateType): Promise<FinancialRate> {
    return this.cacheManager.get<FinancialRate>(this.cacheKey + rate_type);
  }

  async insert(financialRate: FinancialRate): Promise<void> {
    this.cacheManager.set(this.cacheKey + financialRate.rate_type, financialRate, 60 * 60); // Cache for 1 hour
  }

  async delete(rate_type: RateType): Promise<void> {
    await this.cacheManager.del(this.cacheKey + rate_type);
  }
}
