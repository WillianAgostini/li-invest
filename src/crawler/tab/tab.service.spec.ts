import { Test, TestingModule } from '@nestjs/testing';
import { TabService } from './tab.service';

describe('TabService', () => {
  let service: TabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TabService],
    }).compile();

    service = module.get<TabService>(TabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
