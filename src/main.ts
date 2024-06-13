import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SimulationService } from './simulation/simulation.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  const simulationService = app.get<SimulationService>(SimulationService);
  await simulationService.getFees();

  await app.listen(3000);
  Logger.debug('Running');
}
bootstrap();
