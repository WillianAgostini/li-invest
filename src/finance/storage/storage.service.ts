import { Injectable, Scope } from '@nestjs/common';
import { Fees } from '../interface/fees';

@Injectable({
  scope: Scope.DEFAULT,
})
export class StorageService {
  private fees?: Fees;

  getFees(): Fees | undefined {
    return this.fees;
  }

  updateFees(fees: Fees) {
    this.fees = fees;
  }
}
