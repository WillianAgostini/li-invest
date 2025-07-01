import { ApiProperty } from '@nestjs/swagger';

class SimulateDto {
  @ApiProperty({
    description: 'Valor do investimento',
    type: Number,
    example: 1000,
  })
  amount: number;

  @ApiProperty({
    description: 'Meses de investimento',
    type: Number,
    example: 12,
  })
  months: number;
}

export class CdbSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'CDB/RDB percentual CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdiProfiability: number = 100;
}

export class LcxSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'LCI/LCA percentual CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdiProfiability: number = 100;
}
