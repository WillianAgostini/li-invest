import { LcxResult } from '../interface/simulate-result';
import * as finance from './finance';

export function getLcxResult(amount: number, cdi: number, yearlyIndex: number, periods: number) {
  const interestAmount = finance.compoundInterest(amount, getIndexLcx(yearlyIndex, cdi), periods);
  return {
    totalProfit: interestAmount,
    totalAmount: amount + interestAmount,
    cdi: cdi,
    profitability: yearlyIndex,
  } as LcxResult;
}

function getIndexLcx(yearlyInterest: number, cdi: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * cdi) / 100 + 1, 1 / 365);
}
