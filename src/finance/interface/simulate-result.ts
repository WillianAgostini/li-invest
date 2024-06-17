import { ApiProperty } from '@nestjs/swagger';

class InvestmentData {
  @ApiProperty({
    description: 'Rendimento Líquido',
    type: Number,
  })
  totalProfit: number;

  @ApiProperty({
    description: 'Valor Total Líquido',
    type: Number,
  })
  totalAmount: number;
}

export class PoupancaResult extends InvestmentData {
  @ApiProperty({
    description: 'Rentabilidade da Poupança (a.m.) %',
    type: Number,
  })
  poupanca: number;
}

export class CdbResult extends InvestmentData {
  @ApiProperty({
    description: 'Valor total IOF',
    type: Number,
  })
  taxAmount: number;

  @ApiProperty({
    description: 'Taxa IOF',
    type: Number,
  })
  taxPercentage: number;

  @ApiProperty({
    description: 'Imposto de Renda',
    type: Number,
  })
  iofAmount: number;

  @ApiProperty({
    description: 'CDI (a.a.) %',
    type: Number,
  })
  cdi: number;

  @ApiProperty({
    description: 'CDB/RDB percentual CDI',

    type: Number,
  })
  cdb: number;
}

export class LcxResult extends InvestmentData {
  @ApiProperty({
    description: 'LCI/LCA percentual CDI',
    type: Number,
  })
  lcx: number;

  @ApiProperty({
    description: 'CDI (a.a.) %',
    type: Number,
  })
  cdi: number;
}

export class SimulateResult {
  @ApiProperty({
    description: 'Valor Investido',
    type: Number,
  })
  investedAmount: number;

  @ApiProperty({
    description: 'Meses de investimento',
    type: Number,
  })
  periodInMonths: number;

  @ApiProperty({
    description: 'Taxa CDI (a.a) %',
    type: Number,
  })
  cdi: number;

  @ApiProperty({
    description: 'CDB/RDB',
    type: CdbResult,
  })
  cdb: CdbResult;

  @ApiProperty({
    description: 'LCI / LCA',
    type: InvestmentData,
  })
  lcx: LcxResult;

  @ApiProperty({
    description: 'Poupança',
    type: InvestmentData,
  })
  poupanca: PoupancaResult;
}
