import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { CrawlerService } from './crawler/crawler.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  const crawlerService = app.get<CrawlerService>(CrawlerService);
  await crawlerService.getCurrentFees();

  await app.listen(3000);
  Logger.debug('Running');
}
bootstrap();
