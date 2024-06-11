import { Injectable, Scope } from '@nestjs/common';

export interface Fees {
  taxaSelic: string;
  taxaCdi: string;
  ipca: string;
  tr: string;
  tesouroPre: string;
  taxaCustodia: string;
  tesouroIpca: string;
  taxaAdmFundoDi: string;
  rentabCdb: string;
  rentabFundoDi: string;
  rentabLciLca: string;
  taxaPoupanca: string;
}

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
  private fees: Fees;

  getCache() {
    return this.cache;
  }

  updateCache(cache: Map<string, Cache>) {
    this.cache = cache;
  }

  getFees() {
    return this.fees;
  }

  updateFees(fees: Fees) {
    this.fees = fees;
  }
}
