import { Injectable, Logger, Scope } from '@nestjs/common';
import { Page } from 'puppeteer';
import { NewSimulateDto } from 'src/simulation/dto/new-simulate-dto';
import { TabService } from './tab/tab.service';
import { Fees, StorageService } from './storage/storage.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private storageService: StorageService,
    private browserService: TabService,
  ) {}

  async getCurrentFees() {
    this.logger.debug('getCurrentFees init');

    let fees = this.storageService.getFees();
    if (!fees) {
      fees = await this.getFeesOnline();
    }

    this.logger.debug('getCurrentFees finish');
    return fees;
  }

  private async getFeesOnline() {
    const tab = await this.browserService.getFreeTab();
    const localFees = await this.getFees(tab.page);
    this.storageService.updateFees(localFees);
    await this.browserService.releaseTab(tab.id);
    return this.storageService.getFees();
  }

  async simulate(newSimulateDto: NewSimulateDto) {
    this.logger.debug('simulate init');

    const tab = await this.browserService.getFreeTab();

    await tab.page.evaluate(() => {
      document.getElementById('investimento_inicial').removeAttribute('disabled');
      document.getElementById('aporte_iniciais').removeAttribute('disabled');
      document.getElementById('periodo').removeAttribute('disabled');
    });

    await tab.page.type('#investimento_inicial', newSimulateDto.initialValue);
    await tab.page.type('#aporte_iniciais', newSimulateDto.monthlyValue);
    await tab.page.type('#periodo', newSimulateDto.period);

    await tab.page.click('.btn-calcular');

    await tab.page.waitForSelector('#result_cap_init');

    const [resultCapInit, resultAporte, resultPeriodo, resultCapTotal, tableHeaders, tableData] = await Promise.all([
      tab.page.$eval('#result_cap_init', (el) => el.textContent.trim()),
      tab.page.$eval('#result_aporte', (el) => el.textContent.trim()),
      tab.page.$eval('#result_periodo', (el) => el.textContent.trim()),
      tab.page.$eval('#result_cap_total', (el) => el.textContent.trim()),
      tab.page.$$eval('.tabela thead th', (headers) => headers.map((th) => th.textContent.trim())),
      tab.page.$$eval('.tabela tbody tr', (rows) =>
        Array.from(rows, (row) => {
          const columns = row.querySelectorAll('td');
          return Array.from(columns, (column) => column.textContent.trim());
        }),
      ),
    ]);

    const jsonResult = {
      initialInvestedValue: resultCapInit,
      monthlyContributions: resultAporte,
      applicationPeriod: resultPeriodo,
      totalInvestedValue: resultCapTotal,
      results: {},
      attributes: {},
    };

    for (let i = 1; i < 8; i++) {
      jsonResult.results[tableHeaders[i]] = {
        accumulatedGrossValue: tableData[0][i],
        grossProfitability: tableData[1][i],
        costs: tableData[2][i],
        taxesPaid: tableData[3][i],
        accumulatedNetValue: tableData[4][i],
        netProfitability: tableData[5][i],
        netGain: tableData[6][i],
      };
    }

    jsonResult.attributes = await this.getFees(tab.page);
    await this.browserService.releaseTab(tab.id);
    this.logger.debug('simulate finish');
    return jsonResult;
  }

  private async getFees(page: Page) {
    const [taxaSelic, taxaCdi, ipca, tr, tesouroPre, taxaCustodia, tesouroIpca, taxaAdmFundoDi, rentabCdb, rentabFundoDi, rentabLciLca, taxaPoupanca] =
      await Promise.all([
        page.$eval('#taxa_selic', (el) => el.getAttribute('data-default')),
        page.$eval('#taxa_cdi', (el) => el.getAttribute('data-default')),
        page.$eval('#ipca', (el) => el.getAttribute('data-default')),
        page.$eval('#tr', (el) => el.getAttribute('data-default')),
        page.$eval('#tesouro_pre', (el) => el.getAttribute('data-default')),
        page.$eval('#taxa_custodia', (el) => el.getAttribute('data-default')),
        page.$eval('#tesouro_ipca', (el) => el.getAttribute('data-default')),
        page.$eval('#taxa_adm_fundo_di', (el) => el.getAttribute('data-default')),
        page.$eval('#rentab_cdb', (el) => el.getAttribute('data-default')),
        page.$eval('#rentab_fundo_di', (el) => el.getAttribute('data-default')),
        page.$eval('#rentab_lci_lca', (el) => el.getAttribute('data-default')),
        page.$eval('#taxa_poupanca', (el) => el.getAttribute('data-default')),
      ]);

    return {
      taxaSelic,
      taxaCdi,
      ipca,
      tr,
      tesouroPre,
      taxaCustodia,
      tesouroIpca,
      taxaAdmFundoDi,
      rentabCdb,
      rentabFundoDi,
      rentabLciLca,
      taxaPoupanca,
    } as Fees;
  }
}
