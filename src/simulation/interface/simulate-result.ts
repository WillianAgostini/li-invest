import { ApiProperty } from '@nestjs/swagger';

class SimulateResult {
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

export class CdbSimulateResult extends SimulateResult {
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
  profitability: number;
}

export class LcxSimulateResult extends SimulateResult {
  @ApiProperty({
    description: 'LCI/LCA percentual CDI',
    type: Number,
  })
  profitability: number;

  @ApiProperty({
    description: 'CDI (a.a.) %',
    type: Number,
  })
  cdi: number;
}
