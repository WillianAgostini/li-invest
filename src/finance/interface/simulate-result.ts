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

export class SimulateResult {
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
}
