import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

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

export class PoupancaSimulateDto extends SimulateDto {}

export class CdbSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'CDB/RDB percentual CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdiProfiability: number;
}

export class LcxSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'LCI/LCA percentual CDI',
    type: Number,
    required: false,
    example: 100,
    default: 100,
  })
  cdiProfiability: number;
}

export class ProductSimulateDto extends SimulateDto {
  @ApiProperty({
    description: 'Código do Produto de Investimento cadastrado pela Comunidade',
    type: Number,
    required: true,
    example: 1,
    default: 1,
  })
  @IsNumber()
  productId: number;
}
