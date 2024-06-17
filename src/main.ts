import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { SimulationService } from './simulation/simulation.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  app.enableCors();

  const port = process.env.PORT || 3000;
  const serverUrl = process.env.URL_SERVER || process.env.PRODUCTION == 'true' ? 'https://li-invest.koyeb.app' : `http://localhost:${port}`;
  const config = new DocumentBuilder()
    .setTitle('Investment Advisor')
    .setDescription('Assists in choosing fixed-income investments: CDB, RDB, LCI, LCA, and Savings Account.')
    .setVersion('1.0')
    .addServer(serverUrl)
    .build();

  const document = { ...SwaggerModule.createDocument(app, config), openapi: '3.1.0' };
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
