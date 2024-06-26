import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FinanceService } from 'src/finance/finance.service';
import { CdbSimulateResult, LcxSimulateResult, PoupancaSimulateResult } from 'src/finance/interface/simulate-result';
import { InvestmentService } from 'src/investment/investment.service';
import { CdbSimulateDto, LcxSimulateDto, PoupancaSimulateDto, ProductSimulateDto } from './dto/simulate-dto';
import { Investment } from 'src/investment/entity/investment';
import { Fees } from 'src/finance/interface/fees';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);

  constructor(
    private financeService: FinanceService,
    private investmentService: InvestmentService,
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
    const productObject = (await this.investmentService.getById(dto.productId)) as Investment;
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
