import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { SimulateDto } from './dto/simulate-dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SimulateResult } from 'src/finance/interface/simulate-result';
import { Fees } from 'src/finance/interface/fees';

@Controller('simulation')
@ApiTags('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationService.name);

  constructor(private simulationService: SimulationService) {}

  @Get('getFees')
  @ApiResponse({ status: 200, type: Fees })
  async getFees(): Promise<Fees> {
    return await this.simulationService.getFees();
  }

  @Post()
  @ApiBody({ type: SimulateDto })
  @ApiResponse({ status: 201, type: SimulateResult })
  async simulate(@Body() simulateDto: SimulateDto): Promise<SimulateResult> {
    this.logger.debug(simulateDto, 'SimulateDto');
    return await this.simulationService.simulate(simulateDto);
  }
}
