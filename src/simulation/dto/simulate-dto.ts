import { ApiProperty } from '@nestjs/swagger';

export class SimulateDto {
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

  @ApiProperty({
    description: 'CDB/RDB percentual CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdb: number;

  @ApiProperty({
    description: 'LCI/LCA percentual CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  lcx: number;
}
