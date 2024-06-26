import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import { addTrackIdToResponses, addTrackIdToHeaders } from './interceptor/tracking.interceptor';
// import { SimulationService } from './simulation/simulation.service';

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

  let document = { ...SwaggerModule.createDocument(app, config), openapi: '3.1.0' };
  document = addTrackIdToResponses(document);
  document = addTrackIdToHeaders(document);
  writeFileSync('swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger',
  });

  // const simulationService = app.get<SimulationService>(SimulationService);
  // console.log(await simulationService.simulate({
  //   amount: 10000,
  //   months: 12,
  //   lcx: 110,
  //   cdb: 100
  // }));

  await app.listen(port);
  Logger.debug('Running');
}
bootstrap();
