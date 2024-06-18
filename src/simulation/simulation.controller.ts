import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SimulateResult } from 'src/finance/interface/simulate-result';
import { SimulateDto } from './dto/simulate-dto';
import { SimulationService } from './simulation.service';

@Controller('simulation')
@ApiTags('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private simulationService: SimulationService) {}

  @Post()
  @ApiBody({ type: SimulateDto })
  @ApiResponse({ status: 201, type: SimulateResult })
  async simulate(@Body() simulateDto: SimulateDto): Promise<SimulateResult> {
    this.logger.debug(simulateDto, 'SimulateDto');
    return await this.simulationService.simulate(simulateDto);
  }
}
