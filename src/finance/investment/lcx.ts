import { LcxResult } from '../interface/simulate-result';
import * as finance from './finance';

export function getLcxResult(amount: number, di: number, yearlyIndex: number, periods: number) {
  const interestAmount = finance.compoundInterest(amount, getIndexLcx(yearlyIndex, di), periods);
  return {
    totalProfit: interestAmount,
    totalAmount: amount + interestAmount,
    cdi: di,
    lcx: yearlyIndex,
  } as LcxResult;
}

function getIndexLcx(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}
