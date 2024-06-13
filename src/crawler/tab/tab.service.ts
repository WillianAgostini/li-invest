import { Injectable, Logger, Scope } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import puppeteer, { Browser, Page, PageEvent } from 'puppeteer';

@Injectable({
  scope: Scope.DEFAULT,
})
export class TabService {
  private readonly logger = new Logger(TabService.name);

  private browser: Browser;
  private readonly maxTabs: number = parseInt(process.env.MAX_TABS) || 3;
  private tabs: { id: string; page: Page; inUse: boolean }[] = [];

  private readonly url = 'http://localhost:5000';

  constructor() {
    const time = parseInt(process.env.DESTROY_OFF_PAGES_ON_SEC) || 60;
    setInterval(() => {
      this.tabs.forEach(async (x) => {
        if (!x.inUse) {
          this.destroyTab(x.id);
        }
      });
    }, time * 1000);
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      if (process.env.PRODUCTION == 'false') {
        this.browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'] });
      } else {
        this.browser = await puppeteer.launch({
          headless: 'shell',
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
          args: ['--window-size=1920,1080'],
        });
      }
    }
    if (!this.browser.connected) {
      await this.browser.close();
      this.tabs = [];
      this.browser = null;
      return await this.getBrowser();
    }
    return this.browser;
  }

  private async newPage(): Promise<Page> {
    this.logger.debug(`+1 newPage of ${this.tabs.length}`);
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await page.setRequestInterception(true);
    page.on(PageEvent.Request, async (request) => {
      request.abort();
    });

    await page.evaluate(() => {
      document.getElementById('investimento_inicial').removeAttribute('disabled');
      document.getElementById('aporte_iniciais').removeAttribute('disabled');
      document.getElementById('periodo').removeAttribute('disabled');
    });

    return page;
  }

  async getFreeTab(): Promise<{ id: string; page: Page }> {
    let freeTab = this.findFreeTab();
    if (freeTab) {
      freeTab.inUse = true;
      return { id: freeTab.id, page: freeTab.page };
    }

    if (this.tabs.length < this.maxTabs) {
      const id = randomUUID();
      freeTab = { id, page: undefined, inUse: true };
      this.tabs.push(freeTab);
      const page = await this.newPage();
      page.on(PageEvent.Error, (error) => {
        this.logger.error(error);
        this.destroyTab(id);
      });

      freeTab.page = page;
      return { id, page };
    }

    let attemps = 0;
    return new Promise((resolve, reject) => {
      const logInterval = setInterval(() => {
        this.logger.debug('waiting free tab');
      }, 3000);
      const interval = setInterval(() => {
        const freeTab = this.findFreeTab();
        if (freeTab) {
          freeTab.inUse = true;
          clearInterval(interval);
          clearInterval(logInterval);
          resolve({ id: freeTab.id, page: freeTab.page });
        }

        if (attemps++ > 15_000) {
          clearInterval(interval);
          clearInterval(logInterval);
          reject('Not found free tab');
        }
      }, 100);
    });
  }

  private findFreeTab() {
    return this.tabs.find((tab) => !tab.inUse);
  }

  async releaseTab(tabId: string): Promise<void> {
    const tab = this.tabs.find((tab) => tab.id === tabId);
    if (tab) {
      tab.inUse = false;
    }
  }

  async destroyTab(tabId: string): Promise<void> {
    this.logger.debug(`destroyTab of ${this.tabs.length}`);

    const tab = this.tabs.find((tab) => tab.id === tabId);
    this.tabs = this.tabs.filter((tab) => tab.id !== tabId);
    if (!tab.page.isClosed()) await tab?.page?.close();
  }

  async close(): Promise<void> {
    for (const tab of this.tabs) {
      await tab.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}
