import { Injectable, Scope } from '@nestjs/common';

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

  getCache() {
    return this.cache;
  }

  update(cache: Map<string, Cache>) {
    this.cache = cache;
  }
}
