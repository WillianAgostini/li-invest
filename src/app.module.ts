import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback/feedback.controller';
import { FeedbackService } from './feedback/feedback.service';
import { FinanceModule } from './finance/finance.module';
import { SimulationController } from './simulation/simulation.controller';
import { SimulationService } from './simulation/simulation.service';

@Module({
  imports: [FinanceModule],
  controllers: [SimulationController, FeedbackController],
  providers: [SimulationService, FeedbackService],
})
export class AppModule {}
