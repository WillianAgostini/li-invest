import { Injectable, Logger, Scope } from '@nestjs/common';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';

@Injectable({
  scope: Scope.DEFAULT,
})
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  private ignoredUrls: string[];
  private readonly dir = path.resolve(__dirname, 'tmp');
  private readonly file = path.resolve(this.dir, 'ignore');

  constructor() {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir);
    }
  }

  getIgnoredUrls() {
    if (!this.ignoredUrls) this.ignoredUrls = this.getFromStorage();
    return this.ignoredUrls;
  }

  private getFromStorage() {
    if (!existsSync(this.file)) return [];

    return readFileSync(this.file, {
      encoding: 'utf8',
    }).split('\n');
  }

  shouldIgnore(url: string) {
    const ignoreArr = this.getIgnoredUrls();
    return !ignoreArr?.some((x) => x == url);
  }

  appendIgnoredUrls(url: string) {
    this.ignoredUrls.push(url);
    appendFileSync(this.file, url + '\n');
  }
}
