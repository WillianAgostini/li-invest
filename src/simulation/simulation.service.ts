import { Injectable, Logger } from '@nestjs/common';
import { CrawlerService } from 'src/crawler/crawler.service';
import { NewSimulateDto } from './dto/new-simulate-dto';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private crawlerService: CrawlerService) {}

  async simulate(newSimulateDto: NewSimulateDto) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await this.crawlerService.simulate(newSimulateDto);
      } catch (error) {
        if (attempt === 2) {
          throw error;
        }
        console.log(`Attempt ${attempt} failed. Retrying...`);
      }
    }
  }
}
