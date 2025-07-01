import { Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { SimulationService } from 'src/simulation/services/simulation.service';
import { RealTimeResponse } from '../dtos/real-time-response';

@Controller('realTime')
@ApiTags('realTime')
export class RealTimeController {
  constructor(private simulationService: SimulationService) { }

  @Get()
  @ApiResponse({ status: 200, type: RealTimeResponse })
  async get(): Promise<RealTimeResponse> {
    return {
      fees: await this.simulationService.getFees(),
      today: moment().format('DD/MM/YYYY'),
    } as RealTimeResponse;
  }

  @Post('clear')
  @ApiResponse({ status: 204 })
  async clear() {
    this.simulationService.clear();
  }
}
