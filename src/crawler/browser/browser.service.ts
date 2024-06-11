import { Injectable, Scope } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable({
  scope: Scope.DEFAULT,
})
export class BrowserService {
  private browser: Browser;

  async newPage(): Promise<Page> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: 'shell' });
      // this.browser = await puppeteer.launch({ headless: false });
    }
    return await this.browser.newPage();
  }
}
