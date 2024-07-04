import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  const serverUrl = process.env.URL_SERVER || 'https://li-invest.koyeb.app';
  const config = new DocumentBuilder()
    .setTitle('Li Invest')
    .setDescription('Assists in choosing fixed-income investments: CDB, RDB, LCI, LCA, and Savings Account.')
    .setVersion('1.0')
    .addServer(serverUrl)
    .build();

  const document = { ...SwaggerModule.createDocument(app, config), openapi: '3.1.0' };
  writeFileSync('swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger',
  });

  await app.listen(port);
  Logger.debug('Running');
}
bootstrap();
