import { PoupancaResult } from '../interface/simulate-result';
import * as finance from './finance';

export function getPoupancaResult(amount: number, index: number, periods: number) {
  const interestAmount = finance.compoundInterest(amount, getIndexPoupanca(index), calculateFullMonthsDays(periods));
  return {
    totalProfit: interestAmount,
    totalAmount: amount + interestAmount,
    profitability: index,
  } as PoupancaResult;
}

export function calculateFullMonthsDays(days: number): number {
  const daysInMonth = 30;
  return days < daysInMonth ? 0 : Math.floor(days / daysInMonth) * daysInMonth;
}

function getIndexPoupanca(index: number): number {
  return Math.pow(index / 100 + 1, 1 / 30);
}
