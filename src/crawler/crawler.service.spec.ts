import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from 'src/simulation/simulation.service';
import { TabService } from './tab/tab.service';
import { CrawlerService } from './crawler.service';
import { StorageService } from './storage/storage.service';
import { UrlService } from './url/url.service';

describe('CrawlerService', () => {
  let service: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationService, CrawlerService, StorageService, UrlService, TabService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
