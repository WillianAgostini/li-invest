import { Injectable, Logger, Scope } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import puppeteer, { Browser, Page, PageEvent } from 'puppeteer';
import { StorageService } from '../storage/storage.service';
import { UrlService } from '../url/url.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class TabService {
  private readonly logger = new Logger(TabService.name);

  private browser: Browser;
  private readonly maxTabs: number = parseInt(process.env.MAX_TABS) || 3;
  private tabs: { id: string; page: Page; inUse: boolean }[] = [];

  private readonly url = 'https://infograficos.valor.globo.com/calculadoras/calculadora-de-renda-fixa.html#ancor';

  constructor(
    private storageService: StorageService,
    private urlService: UrlService,
  ) {}

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
    const cache = this.storageService.getCache();
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.setRequestInterception(true);
    const requestInterceptor = async (request) => {
      const requestUrl = request.url();
      const content = this.urlService.shouldIgnore(requestUrl) && cache.get(requestUrl);
      if (content) {
        try {
          await request.respond(content);
        } catch (error) {
          request.continue();
          this.urlService.appendIgnoredUrls(requestUrl);
        } finally {
          return;
        }
      }
      request.continue();
    };
    page.on(PageEvent.Request, requestInterceptor);

    page.on(PageEvent.Response, async (response) => {
      const responseUrl = response.url();
      if (this.urlService.shouldIgnore(responseUrl) && !cache.get(responseUrl)) {
        try {
          const buffer = await response.buffer();
          cache.set(responseUrl, {
            status: response.status(),
            headers: response.headers(),
            body: buffer,
          });
        } catch (error) {
          // some responses do not contain buffer and do not need to be caught
          return;
        }
      }
    });
    await page.goto(this.url, { waitUntil: 'domcontentloaded' });
    this.storageService.updateCache(cache);
    page.off(PageEvent.Request, requestInterceptor);
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
    const tab = this.tabs.find((tab) => tab.id === tabId);
    if (!tab.page.isClosed()) await tab?.page?.close();
    this.tabs = this.tabs.filter((tab) => tab.id !== tabId);
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
