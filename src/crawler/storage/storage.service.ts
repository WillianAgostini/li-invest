import { Injectable, Logger, Scope } from '@nestjs/common';

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
  private readonly logger = new Logger(StorageService.name);

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

  private hasUndefinedOrNullValues(obj: any): boolean {
    if (obj === undefined || obj === null) return true;
    if (typeof obj !== 'object') return false;

    for (const key in obj) {
      if (this.hasUndefinedOrNullValues(obj[key])) {
        return true;
      }
    }
    return false;
  }

  updateFees(fees: Fees) {
    try {
      if (this.hasUndefinedOrNullValues(fees)) {
        this.logger.debug('hasUndefinedOrNullValues on fees');
        fees = undefined;
      }
    } catch (error) {
      this.logger.error(error);
      fees = undefined;
    }

    this.fees = fees;
  }
}
