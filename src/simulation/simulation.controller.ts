import { Body, Controller, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { NewSimulateDto } from './dto/new-simulate-dto';

@Controller('simulation')
export class SimulationController {
  constructor(private simulationService: SimulationService) {}

  @Post()
  async simulate(@Body() newSimulateDto: NewSimulateDto): Promise<any> {
    try {
      return await this.simulationService.simulate(newSimulateDto);
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }
}
