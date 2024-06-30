import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CdbSimulateResult, LcxSimulateResult, PoupancaSimulateResult } from 'src/simulation/interface/simulate-result';
import { CdbSimulateDto, LcxSimulateDto, PoupancaSimulateDto, ProductSimulateDto } from '../dto/simulate-dto';
import { SimulationService } from '../services/simulation.service';

@Controller('simulation')
@ApiTags('simulation')
export class SimulationController {
  private readonly logger = new Logger(SimulationController.name);

  constructor(private simulationService: SimulationService) {}

  @Post('poupanca')
  @ApiBody({ type: PoupancaSimulateDto })
  @ApiResponse({ status: 201, type: PoupancaSimulateResult })
  async poupanca(@Body() simulateDto: PoupancaSimulateDto): Promise<PoupancaSimulateResult> {
    return await this.simulationService.poupancaSimulate(simulateDto);
  }

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

  @Post('product')
  @ApiBody({ type: ProductSimulateDto })
  @ApiResponse({
    status: 201,
    schema: {
      oneOf: [{ $ref: '#/components/schemas/CdbSimulateResult' }, { $ref: '#/components/schemas/LcxSimulateResult' }],
    },
  })
  async product(@Body() dto: ProductSimulateDto): Promise<CdbSimulateResult | LcxSimulateResult> {
    return await this.simulationService.simulateProduct(dto);
  }
}
