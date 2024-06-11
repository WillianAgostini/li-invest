import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.DEFAULT,
})
export class UrlService {
  private ignoredUrls: string[] = [];

  getIgnoredUrls() {
    return this.ignoredUrls;
  }

  shouldIgnore(url: string) {
    const ignoreArr = this.getIgnoredUrls();
    return !ignoreArr?.some((x) => x == url);
  }

  appendIgnoredUrls(url: string) {
    this.ignoredUrls.push(url);
  }
}
