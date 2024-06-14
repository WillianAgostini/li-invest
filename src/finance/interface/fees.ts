import { ApiProperty } from '@nestjs/swagger';

export class DetailedValues {
  @ApiProperty({
    description: 'Valor em %',
    type: Number,
  })
  value: number;

  @ApiProperty({
    description: 'Data de atualização',
    type: String,
  })
  updatedAt: string;
}

export class Fees {
  @ApiProperty({
    description: 'Fundos de Investimento',
    type: DetailedValues,
  })
  di: DetailedValues;

  @ApiProperty({
    description: 'Taxa Referencial (a.m.) %',
    type: DetailedValues,
  })
  tr: DetailedValues;

  @ApiProperty({
    description: 'IPCA (a.a.) %',
    type: DetailedValues,
  })
  ipca: DetailedValues;

  @ApiProperty({
    description: 'CDI (a.a.) %',
    type: DetailedValues,
  })
  cdi: DetailedValues;

  @ApiProperty({
    description: 'SELIC (a.a.) %',
    type: DetailedValues,
  })
  selic: DetailedValues;

  @ApiProperty({
    description: 'Rentabilidade da Poupança (a.m.) %',
    type: DetailedValues,
  })
  poupanca: DetailedValues;
}
