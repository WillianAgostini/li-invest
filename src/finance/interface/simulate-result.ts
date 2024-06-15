import { ApiProperty } from '@nestjs/swagger';

export class InvestmentData {
  @ApiProperty({
    description: 'Valor Investido',
    type: Number,
  })
  investedAmount: number;

  @ApiProperty({
    description: 'Rendimento Bruto',
    type: Number,
  })
  interestAmount: number;

  @ApiProperty({
    description: 'Valor Total Líquido',
    type: Number,
  })
  totalAmount: number;
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
}

export class Variables {
  @ApiProperty({
    description: 'CDB/RDB percentual DI',
    type: Number,
  })
  cdb: number;

  @ApiProperty({
    description: 'LCI/LCA percentual DI',
    type: Number,
  })
  lcx: number;

  @ApiProperty({
    description: 'Taxa DI (a.a) %',
    type: Number,
  })
  di: number;

  @ApiProperty({
    description: 'Rentabilidade da Poupança (a.m.) %',
    type: Number,
  })
  poupanca: number;
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
    description: 'CDB/RDB',
    type: CdbResult,
  })
  cdb: CdbResult;

  @ApiProperty({
    description: 'LCI / LCA',
    type: InvestmentData,
  })
  lcx: InvestmentData;

  @ApiProperty({
    description: 'Poupança',
    type: InvestmentData,
  })
  poupanca: InvestmentData;

  @ApiProperty({
    description: 'Variáveis utilizadas',
    type: InvestmentData,
  })
  variables: Variables;
}
