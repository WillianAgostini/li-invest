import { Body, Controller, Logger, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { NewFeedbackDto } from './dto/new-feedback-dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('feedback')
@ApiTags('feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @ApiBody({ type: NewFeedbackDto })
  @ApiResponse({ status: 201 })
  async simulate(@Body() newFeedbackDto: NewFeedbackDto): Promise<void> {
    this.logger.debug(newFeedbackDto, 'newSimulateDto');
    await this.feedbackService.insert(newFeedbackDto);
  }
}
