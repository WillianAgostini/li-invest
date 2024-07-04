import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FinanceService } from 'src/simulation/services/finance.service';
import { CdbSimulateResult, LcxSimulateResult, PoupancaSimulateResult } from 'src/simulation/interface/simulate-result';
import { Investment } from 'src/investment/entities/investment';
import { Fees } from 'src/simulation/interface/fees';
import { CdbSimulateDto, LcxSimulateDto, PoupancaSimulateDto, ProductSimulateDto } from '../dto/simulate-dto';
import { InvestmentRepository } from 'src/investment/repositories/investment.repository';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private financeService: FinanceService,
    private investmentRepository: InvestmentRepository,
  ) {}

  getFees(): Promise<Fees> {
    return this.financeService.getCurrentFees();
  }

  clear(): void {
    return this.financeService.clearFees();
  }

  poupancaSimulate(dto: PoupancaSimulateDto): Promise<PoupancaSimulateResult> {
    return this.financeService.poupancaSimulate(dto);
  }

  cdbSimulate(dto: CdbSimulateDto): Promise<CdbSimulateResult> {
    return this.financeService.cdbSimulate(dto);
  }

  lcxSimulate(dto: LcxSimulateDto): Promise<LcxSimulateResult> {
    return this.financeService.lcxSimulate(dto);
  }

  async simulateProduct(dto: ProductSimulateDto): Promise<CdbSimulateResult | LcxSimulateResult> {
    const productObject = (await this.investmentRepository.getById(dto.productId)) as Investment;
    if (!productObject) {
      throw new NotFoundException(`Produto ${dto.productId} não encontrado`);
    }

    if (productObject.profitabilityType != 'CDI') {
      throw new BadRequestException(`Diponível simulação apenas com rentabilidade de CDI no momento`);
    }

    if (dto.months > productObject.getMonthsUntilMaturity() + 1) {
      throw new BadRequestException('Data da simulação não pode ser maior que a data final do investimento');
    }

    if (productObject.type == 'CDB') {
      return this.cdbSimulate({
        amount: dto.amount,
        months: dto.months,
        cdiProfiability: productObject.profitability,
      });
    }

    if (productObject.type == 'LCA' || productObject.type == 'LCI') {
      return this.lcxSimulate({
        amount: dto.amount,
        months: dto.months,
        cdiProfiability: productObject.profitability,
      });
    }

    throw new BadRequestException(`Simulação para ${productObject.type} não implementada no momento`);
  }
}
