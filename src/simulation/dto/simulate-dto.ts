import { ApiProperty } from '@nestjs/swagger';

class SimulateDto {
  @ApiProperty({
    description: 'Investment amount',
    type: Number,
    example: 1000,
  })
  amount: number;

  @ApiProperty({
    description: 'Investment months',
    type: Number,
    example: 12,
  })
  months: number;
}

export class CdbSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'CDB/RDB percent of CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdiProfitability: number = 100;
}

export class LcxSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'LCI/LCA percent of CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdiProfitability: number = 100;
}
