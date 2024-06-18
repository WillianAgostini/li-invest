import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'Tipo da aplicação',
    examples: ['LCA', 'LCI', 'CDB'],
    required: false,
  })
  @IsNotEmpty()
  @IsIn(['LCA', 'LCI', 'CDB'], {
    message: 'Disponíbel apenas investimento do tipo LCA, LCI ou CDB',
  })
  type: 'LCA' | 'LCI' | 'CDB';

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
  @IsNotEmpty()
  originBank: string;

  @ApiProperty({
    description: 'Aplicação Mínima',
    example: 100.0,
    type: 'number',
  })
  @IsNotEmpty()
  minimumApplication: number;

  @ApiProperty({
    description: 'Vencimento',
    example: '2025-12-31',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty()
  maturity: Date;

  @ApiProperty({
    description: 'Rentabilidade',
    example: 100,
    type: 'number',
  })
  @IsNotEmpty()
  profitability: number;

  @ApiProperty({
    description: 'Rentabilidade do',
    example: 'CDI',
    default: 'CDI',
  })
  @IsNotEmpty()
  @IsIn(['CDI'], {
    message: 'Disponível apenas Rendimento por CDI no momento',
  })
  profitabilityType: 'CDI';
}

export class CreateInvestmentResultDto extends CreateInvestmentDto {
  @ApiProperty({
    description: 'ID',
  })
  id: number;

  @ApiProperty({
    description: 'Dias até o vencimento a partir da data atual',
    example: 100,
    type: 'number',
  })
  daysUntilMaturity: number;

  @ApiProperty({
    description: 'Meses até o vencimento a partir da data atual',
    example: 100,
    type: 'number',
  })
  monthsUntilMaturity: number;
}
