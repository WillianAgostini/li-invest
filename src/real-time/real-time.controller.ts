import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SimulationService } from 'src/simulation/simulation.service';
import { RealTimeResponse } from './interface/real-time-response';
import moment from 'moment';

@Controller('realTime')
@ApiTags('realTime')
export class RealTimeController {
  constructor(private simulationService: SimulationService) {}

  @Get()
  @ApiResponse({ status: 200, type: RealTimeResponse })
  async get(): Promise<RealTimeResponse> {
    return {
      fees: await this.simulationService.getFees(),
      today: moment().format('DD/MM/YYYY'),
    } as RealTimeResponse;
  }
}
