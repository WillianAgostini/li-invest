import { Module } from '@nestjs/common';
import { CrawlerModule } from './crawler/crawler.module';
import { SimulationController } from './simulation/simulation.controller';
import { SimulationService } from './simulation/simulation.service';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackService } from './feedback/feedback.service';

@Module({
  imports: [CrawlerModule],
  controllers: [SimulationController, FeedbackController],
  providers: [SimulationService, FeedbackService],
})
export class AppModule {}
