import { ApiProperty } from '@nestjs/swagger';
import { Fees } from 'src/simulation/interface/fees';

export class RealTimeResponse {
  @ApiProperty({
    description: 'Set of financial rates',
    type: Fees,
  })
  fees: Fees;

  @ApiProperty({
    description: 'Current date',
    type: String,
    example: '18/06/2024',
  })
  today: string;
}
