import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Feedback } from './entity/feedback';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    @InjectRepository(Feedback)
    private financialRateRepository: Repository<Feedback>,
  ) {}

  insert(data: object): Promise<InsertResult> {
    return this.financialRateRepository.insert({
      data,
    });
  }
}
