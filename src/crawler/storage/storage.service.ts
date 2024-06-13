import { Injectable, Scope } from '@nestjs/common';

export interface DetailedValues {
  value: string;
  updatedAt?: string;
  description: string;
}

export interface OnlineFees {
  tr: DetailedValues;
  ipca: DetailedValues;
  cdi: DetailedValues;
  selic: DetailedValues;
  poupanca: DetailedValues;
}

export interface OflineFees {
  taxa: {
    custodia: DetailedValues;
    admFundoDi: DetailedValues;
  };
  juro: {
    tesouroPre: DetailedValues;
    tesouroIpca: DetailedValues;
  };
  rentabilidade: {
    cdb: DetailedValues;
    fundoDi: DetailedValues;
    lciLca: DetailedValues;
  };
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
  private fees?: Fees;

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
    const hasUndefinedValues = Object.values(fees).some((x) => x == null || x == undefined);
    if (hasUndefinedValues) {
      fees = undefined;
    }
    this.fees = fees;
  }
}
