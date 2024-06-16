import { CdbResult } from '../interface/simulate-result';
import * as finance from './finance';

export function getCDBResult(amount: number, di: number, yearlyIndex: number, days: number): CdbResult {
  const interestAmount = finance.compoundInterest(amount, getIndexCDB(yearlyIndex, di), days);
  const taxPercentage = finance.getIndexIR(days);
  const iofAmount = finance.getIOFAmount(days, interestAmount);
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100);
  const totalProfit = interestAmount - iofAmount - (taxAmount ?? 0)
  const totalAmount = amount + totalProfit

  return {
    interestAmount,
    totalAmount,
    taxAmount,
    taxPercentage,
    iofAmount,
  };
}

function getIndexCDB(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}
