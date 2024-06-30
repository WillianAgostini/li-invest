import { Module } from '@nestjs/common';
import { RealTimeController } from './controllers/real-time.controller';
import { SimulationModule } from 'src/simulation/simulation.module';

@Module({
  imports: [SimulationModule],
  controllers: [RealTimeController],
  providers: [],
  exports: [],
})
export class RealTimeModule {}
