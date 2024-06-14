import { ApiProperty } from '@nestjs/swagger';

export class SimulateDto {
  @ApiProperty({
    description: 'Valor do investimento',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Meses de investimento',
    type: Number,
  })
  months: number;

  @ApiProperty({
    description: 'CDB/RDB percentual DI',
    type: Number,
    required: false,
    default: 100,
  })
  cdb: number;

  @ApiProperty({
    description: 'LCI/LCA percentual DI',
    type: Number,
    required: false,
    default: 100,
  })
  lcx: number;
}
