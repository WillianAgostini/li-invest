import { Body, Controller, Logger, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { NewFeedbackDto } from './dto/new-feedback-dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @ApiBody({ type: NewFeedbackDto })
  @ApiResponse({ status: 201 })
  async simulate(@Body() newFeedbackDto: NewFeedbackDto): Promise<void> {
    try {
      this.logger.debug(newFeedbackDto, 'newSimulateDto');
      await this.feedbackService.insert(newFeedbackDto);
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }
}
