import { Investment } from 'src/investment/entity/investment';
import { SimulateDto } from 'src/simulation/dto/simulate-dto';

export class Simulate extends SimulateDto {
  days: number;
  productObject?: Investment;
}
