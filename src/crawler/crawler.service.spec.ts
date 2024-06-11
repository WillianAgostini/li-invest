import { Test, TestingModule } from '@nestjs/testing';
import { SimulationService } from 'src/simulation/simulation.service';
import { BrowserService } from './browser/browser.service';
import { CrawlerService } from './crawler.service';
import { StorageService } from './storage/storage.service';
import { UrlService } from './url/url.service';

describe('CrawlerService', () => {
  let service: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationService, CrawlerService, StorageService, UrlService, BrowserService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
