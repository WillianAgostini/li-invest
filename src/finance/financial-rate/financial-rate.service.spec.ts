import { Test, TestingModule } from '@nestjs/testing';
import { FinancialRateService } from './financial-rate.service';

describe('FinancialRateService', () => {
  let service: FinancialRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialRateService],
    }).compile();

    service = module.get<FinancialRateService>(FinancialRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
