import { CreateInvestmentResultDto } from '../dto/create-investment-dto';
import { Investment } from '../entity/investment';

export class InvestmentMapper {
  static toCreateInvestmentResultDto(investment: Investment): CreateInvestmentResultDto {
    return {
      ...investment,
      daysUntilMaturity: investment.getDaysUntilMaturity(),
      monthsUntilMaturity: investment.getMonthsUntilMaturity(),
    } as CreateInvestmentResultDto;
  }

  static toCreateInvestmentResultDtoArray(investments: Investment[]): CreateInvestmentResultDto[] {
    return investments.map((investment) => this.toCreateInvestmentResultDto(investment));
  }
}
