import { ApiProperty } from '@nestjs/swagger';
import { Fees } from 'src/simulation/interface/fees';

export class RealTimeResponse {
  @ApiProperty({
    description: 'Conjunto de taxas e índices financeiros',
    type: Fees,
  })
  fees: Fees;

  @ApiProperty({
    description: 'Data atual',
    type: String,
    example: '18/06/2024',
  })
  today: string;
}
