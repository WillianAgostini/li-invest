import { InvestmentData } from '../interface/simulate-result';
import * as finance from './finance';

export function getLcxResult(amount: number, di: number, yearlyIndex: number, periods: number): InvestmentData {
  const interestAmount = finance.compoundInterest(amount, getIndexLcx(yearlyIndex, di), periods);
  return {
    interestAmount,
    totalAmount: amount + interestAmount,
  };
}

function getIndexLcx(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}
