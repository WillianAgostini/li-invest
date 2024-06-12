import { Module } from '@nestjs/common';
import { SimulationService } from 'src/simulation/simulation.service';
import { TabService } from './tab/tab.service';
import { CrawlerService } from './crawler.service';
import { StorageService } from './storage/storage.service';
import { UrlService } from './url/url.service';

@Module({
  imports: [CrawlerModule],
  controllers: [],
  providers: [SimulationService, CrawlerService, StorageService, UrlService, TabService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
