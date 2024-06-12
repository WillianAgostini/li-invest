import { Body, Controller, Logger, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private feedbackService: FeedbackService) {}

  @Post()
  async simulate(@Body() newFeedbackDto: any): Promise<void> {
    try {
      this.logger.debug(newFeedbackDto, 'newSimulateDto');
      await this.feedbackService.insertData(newFeedbackDto);
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }
}
