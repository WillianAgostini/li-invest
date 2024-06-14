import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  const config = new DocumentBuilder()
    .setTitle('Investment Advisor')
    .setDescription('Assists in choosing fixed-income investments: CDB, RDB, LCI, LCA, and Savings Account.')
    .setVersion('1.0')
    .addServer('https://lb-node-willians-project-0e2f53cf.koyeb.app')
    .build();

  const document = { ...SwaggerModule.createDocument(app, config), openapi: '3.1.0' };
  writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  Logger.debug('Running');
}
bootstrap();
