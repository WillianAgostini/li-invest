import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'Tipo da aplicação',
    example: 'LCA',
    required: false,
  })
  type: string;

  @ApiProperty({
    description: 'Emissor',
    example: 'Banco Itaú',
    required: false,
  })
  issuer?: string;

  @ApiProperty({
    description: 'Banco que disponibiliza o investimento',
    example: 'Itaú',
  })
  originBank: string;

  @ApiProperty({
    description: 'Aplicação Mínima',
    example: 100.0,
    type: 'number',
  })
  minimumApplication: number;

  @ApiProperty({
    description: 'Vencimento',
    example: '2025-12-31',
    type: 'string',
    format: 'date',
  })
  maturity: Date;

  @ApiProperty({
    description: 'Rentabilidade',
    example: 100,
    type: 'number',
  })
  profitability: number;

  @ApiProperty({
    description: 'Rentabilidade do',
    example: 'CDI',
  })
  profitabilityType: string;
}

export class CreateInvestmentDtoResult extends CreateInvestmentDto {
  @ApiProperty({
    description: 'ID',
  })
  id: number;
}
