import { Injectable, Scope } from '@nestjs/common';

export interface OnlineFees {
  ipca: string;
  ipcaUdatedAt: string;
  cdi: string;
  cdiUdatedAt: string;
  selic: string;
  selicUdatedAt: string;
  poupanca: string;
  poupancaUdatedAt: string;
}

export interface OflineFees {
  tr: string;
  tesouroPre: string;
  custodia: string;
  tesouroIpca: string;
  admFundoDi: string;
  rentabCdb: string;
  rentabFundoDi: string;
  rentabLciLca: string;
}

export interface Fees extends OnlineFees, OflineFees {}

export interface Cache {
  body: Buffer;
  status: number;
  headers: Record<string, string>;
}

@Injectable({
  scope: Scope.DEFAULT,
})
export class StorageService {
  private cache = new Map<string, Cache>();
  private fees?: OflineFees;

  getCache() {
    return this.cache;
  }

  updateCache(cache: Map<string, Cache>) {
    this.cache = cache;
  }

  getFees() {
    return this.fees;
  }

  updateFees(fees: OflineFees) {
    const hasUndefinedValues = Object.values(fees).some((x) => x == null || x == undefined);
    if (hasUndefinedValues) {
      fees = undefined;
    }
    this.fees = fees;
  }
}
