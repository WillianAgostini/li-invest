import { Injectable, Logger, Scope } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export interface Cache {
  [key: string]: {
    body: Buffer;
    status: number;
    headers: Record<string, string>;
  };
}

export interface Storage {
  data: Cache;
  refresh: boolean;
  path: string;
}

@Injectable({
  scope: Scope.DEFAULT,
})
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly dir = path.resolve(__dirname, 'tmp');

  private storage: Storage;

  constructor() {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir);
    }
  }

  getCache() {
    if (!this.storage?.data) this.storage = this.getFromStorage();
    return this.storage.data;
  }

  update(cache: Cache) {
    if (!this.storage.refresh) {
      return;
    }
    this.storage.refresh = false;

    this.logger.debug('saveCache');
    const jsonData = JSON.stringify(cache.data, (key, value) => {
      if (key === 'body' && value instanceof Buffer) return value.toString('base64');
      return value;
    });
    writeFileSync(this.storage.path, jsonData);
  }

  private getFromStorage() {
    const hash = 'defaultPage';
    const filePath = path.resolve(this.dir, hash);
    if (!existsSync(filePath)) {
      return {
        data: {},
        refresh: true,
        path: filePath,
      };
    }

    return {
      data: this.loadCacheFromFile(filePath) as Cache,
      refresh: false,
      path: filePath,
    };
  }

  private loadCacheFromFile(filePath: string) {
    this.logger.debug('loadCacheFromFile');
    const jsonData = readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData, (key, value) => {
      if (key === 'body') {
        return Buffer.from(value, 'base64');
      }
      return value;
    });
    return data;
  }
}
