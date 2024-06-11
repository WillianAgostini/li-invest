import { Module } from '@nestjs/common';
import { SimulationService } from 'src/simulation/simulation.service';
import { BrowserService } from './browser/browser.service';
import { CrawlerService } from './crawler.service';
import { StorageService } from './storage/storage.service';
import { UrlService } from './url/url.service';

@Module({
  imports: [CrawlerModule],
  controllers: [],
  providers: [SimulationService, CrawlerService, StorageService, UrlService, BrowserService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
