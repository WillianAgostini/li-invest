import { Injectable, Logger, Scope } from '@nestjs/common';
import puppeteer, { Browser, Page, PageEvent } from 'puppeteer';
import { UrlService } from '../url/url.service';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'node:crypto';

@Injectable({
  scope: Scope.DEFAULT,
})
export class TabService {
  private readonly logger = new Logger(TabService.name);

  private browser: Browser;
  private readonly maxTabs: number = parseInt(process.env.MAX_TABS) || 3;
  private tabs: { id: string; page: Page; inUse: boolean; destroyOnRelease: boolean }[] = [];

  private readonly url = 'https://infograficos.valor.globo.com/calculadoras/calculadora-de-renda-fixa.html#ancor';

  constructor(
    private storageService: StorageService,
    private urlService: UrlService,
  ) {
    this.getBrowser().then(() => this.logger.debug('init browser'));
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'shell',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });
      // this.browser = await puppeteer.launch({ headless: false });
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
    await page.setViewport({ width: 1080, height: 1024 });
    page.off(PageEvent.Request, requestInterceptor);
    page.on(PageEvent.Request, async (request) => {
      request.abort();
    });
    return page;
  }

  async getFreeTab(): Promise<{ id: string; page: Page }> {
    let freeTab = this.findFreeTab();
    if (freeTab) {
      freeTab.inUse = true;
      return { id: freeTab.id, page: freeTab.page };
    }

    const page = await this.newPage();
    const id = randomUUID();
    if (this.tabs.length < this.maxTabs) {
      freeTab = { id, page, inUse: true, destroyOnRelease: false };
      this.tabs.push(freeTab);
      return { id, page };
    }

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.logger.debug('waiting free tab');
        const freeTab = this.findFreeTab();
        if (freeTab) {
          freeTab.inUse = true;
          clearInterval(interval);
          resolve({ id: freeTab.id, page: freeTab.page });
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
    if (tab.destroyOnRelease) {
      await tab.page.close();
    }
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
