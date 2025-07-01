import { ApiProperty } from '@nestjs/swagger';

class SimulateResult {
  @ApiProperty({
    description: 'Invested amount',
    type: Number,
  })
  investedAmount: number;

  @ApiProperty({
    description: 'Investment months',
    type: Number,
  })
  periodInMonths: number;

  @ApiProperty({
    description: 'Net yield',
    type: Number,
  })
  totalProfit: number;

  @ApiProperty({
    description: 'Net total value',
    type: Number,
  })
  totalAmount: number;
}

export class CdbSimulateResult extends SimulateResult {
  @ApiProperty({
    description: 'Total IOF tax',
    type: Number,
  })
  taxAmount: number;

  @ApiProperty({
    description: 'IOF rate',
    type: Number,
  })
  taxPercentage: number;

  @ApiProperty({
    description: 'Income tax',
    type: Number,
  })
  iofAmount: number;

  @ApiProperty({
    description: 'CDI (YoY) %',
    type: Number,
  })
  cdi: number;

  @ApiProperty({
    description: 'CDB/RDB percent of CDI',
    type: Number,
  })
  profitability: number;
}

export class LcxSimulateResult extends SimulateResult {
  @ApiProperty({
    description: 'LCI/LCA percent of CDI',
    type: Number,
  })
  profitability: number;

  @ApiProperty({
    description: 'CDI (YoY) %',
    type: Number,
  })
  cdi: number;
}
