import { Module } from '@nestjs/common';
import { SimulationService } from 'src/simulation/simulation.service';
import { TabService } from './tab/tab.service';
import { CrawlerService } from './crawler.service';
import { StorageService } from './storage/storage.service';
import { UrlService } from './url/url.service';
import { FeeService } from './fee/fee.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CrawlerModule, HttpModule],
  controllers: [],
  providers: [SimulationService, CrawlerService, StorageService, UrlService, TabService, FeeService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
