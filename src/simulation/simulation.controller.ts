import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { NewSimulateDto } from './dto/new-simulate-dto';

@Controller('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private simulationService: SimulationService) {}

  @Get('getFees')
  async getFees(): Promise<any> {
    try {
      return await this.simulationService.getFees();
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }

  @Post()
  async simulate(@Body() newSimulateDto: NewSimulateDto): Promise<any> {
    try {
      this.logger.debug(newSimulateDto, 'newSimulateDto');
      return await this.simulationService.simulate(newSimulateDto);
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }
}
