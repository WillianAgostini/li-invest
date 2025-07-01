import moment from 'moment';
import { DetailedValues } from '../interface/fees';

export enum RateType {
  CDI = 'cdi',
  IPCA = 'ipca',
  SELIC = 'selic',
  USD = 'usd',
}

export class FinancialRate {
  rate_type: RateType;

  value: number;

  updatedAt: string;

  toDetailedValues(): DetailedValues {
    return {
      value: this.value,
      updatedAt: moment(this.updatedAt).format('DD/MM/YYYY'),
    };
  }
}
