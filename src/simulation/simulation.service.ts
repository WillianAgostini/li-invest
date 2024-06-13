import { Injectable, Logger } from '@nestjs/common';
import { CrawlerService } from 'src/crawler/crawler.service';
import { NewSimulateDto } from './dto/new-simulate-dto';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private crawlerService: CrawlerService) {}

  async getFees() {
    return await this.crawlerService.getCurrentFees();
  }

  async simulate(newSimulateDto: NewSimulateDto) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await this.crawlerService.simulate({
          initialValue: newSimulateDto.initialValue?.toString() ?? '0',
          monthlyValue: newSimulateDto.monthlyValue?.toString() ?? '0',
          period: newSimulateDto.period?.toString() ?? '0',
          cdbReturn: newSimulateDto.cdbReturn?.toString(),
        });
      } catch (error) {
        if (attempt === 3) {
          throw error;
        }
        console.log(`Attempt ${attempt} failed. Retrying...`);
      }
    }
  }
}
