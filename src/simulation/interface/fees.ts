import { ApiProperty } from '@nestjs/swagger';

export class DetailedValues {
  @ApiProperty({
    description: 'Value (%)',
    type: Number,
  })
  value: number;

  @ApiProperty({
    description: 'Update date',
    type: String,
  })
  updatedAt: string;
}

export class Fees {
  @ApiProperty({
    description: 'IPCA (YoY) %',
    type: DetailedValues,
  })
  ipca: DetailedValues;

  @ApiProperty({
    description: 'CDI (YoY) %',
    type: DetailedValues,
  })
  cdi: DetailedValues;

  @ApiProperty({
    description: 'SELIC (YoY) %',
    type: DetailedValues,
  })
  selic: DetailedValues;

  @ApiProperty({
    description: 'US Dollar',
    type: DetailedValues,
  })
  usd: DetailedValues;

  @ApiProperty({
    description: 'CDB/RDB percent of CDI',
    type: Number,
  })
  cdbProfitability: number = 100;

  @ApiProperty({
    description: 'LCI/LCA percent of CDI',
    type: Number,
  })
  lcxProfitability: number = 100;
}
