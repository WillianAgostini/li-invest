import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CdbSimulateResult, LcxSimulateResult } from 'src/simulation/interface/simulate-result';
import { CdbSimulateDto, LcxSimulateDto } from '../dto/simulate-dto';
import { SimulationService } from '../services/simulation.service';

@Controller('simulation')
@ApiTags('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationController.name);

  constructor(private simulationService: SimulationService) { }

  @Post('cdb')
  @ApiBody({ type: CdbSimulateDto })
  @ApiResponse({ status: 201, type: CdbSimulateResult })
  async cdb(@Body() dto: CdbSimulateDto): Promise<CdbSimulateResult> {
    return await this.simulationService.cdbSimulate(dto);
  }

  @Post('lcx')
  @ApiBody({ type: LcxSimulateDto })
  @ApiResponse({ status: 201, type: LcxSimulateResult })
  async lcx(@Body() dto: LcxSimulateDto): Promise<LcxSimulateResult> {
    return await this.simulationService.lcxSimulate(dto);
  }

}
