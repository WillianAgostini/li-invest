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
    description: 'Taxa DI (a.a) %',
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

  @ApiProperty({
    description: 'Dólar comercial',
    type: DetailedValues,
  })
  usd: DetailedValues;

  @ApiProperty({
    description: 'CDB/RDB percentual CDI',
    type: Number,
  })
  rentabilidadeCdb: number = 100;

  @ApiProperty({
    description: 'LCI/LCA percentual CDI',
    type: Number,
  })
  rentabilidadeLcx: number = 100;
}
