import { InvestmentData } from '../interface/investment-data';
import * as finance from './finance';

export interface CdbResult extends InvestmentData {
  taxAmount: number;
  taxPercentage: number;
  iofAmount: number;
}

export function getCDBResult(amount: number, di: number, yearlyIndex: number, days: number): CdbResult {
  const interestAmount = finance.compoundInterest(amount, getIndexCDB(yearlyIndex, di), days);
  const taxPercentage = finance.getIndexIR(days);
  const iofAmount = finance.getIOFAmount(days, interestAmount);
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100);
  return {
    interestAmount,
    investedAmount: amount,
    totalAmount: amount + interestAmount,
    taxAmount,
    taxPercentage,
    iofAmount,
  };
}

function getIndexCDB(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}
