import { Module } from '@nestjs/common';
import { CrawlerModule } from './crawler/crawler.module';
import { SimulationController } from './simulation/simulation.controller';
import { SimulationService } from './simulation/simulation.service';

@Module({
  imports: [CrawlerModule],
  controllers: [SimulationController],
  providers: [SimulationService],
})
export class AppModule {}
