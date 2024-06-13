import { Injectable, Logger, Scope } from '@nestjs/common';
import { Page } from 'puppeteer';
import { convertCurrencyStringToNumber } from 'src/utils/conveter';
import { delay } from 'src/utils/time';
import { FeeService } from './fee/fee.service';
import { NewSimulate } from './interface/new-simulate';
import { OflineFees, StorageService } from './storage/storage.service';
import { TabService } from './tab/tab.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private storageService: StorageService,
    private tabService: TabService,
    private feeService: FeeService,
  ) {}

  async getCurrentFees() {
    this.logger.debug('getCurrentFees init');

    let fees = this.storageService.getFees();
    if (!fees) {
      fees = await this.getFeesOnline();
    }

    this.logger.debug('getCurrentFees finish');
    return JSON.parse(JSON.stringify(fees));
  }

  private async getFeesOnline() {
    const tab = await this.tabService.getFreeTab();
    const [onlineFees, pageFees] = await Promise.all([this.feeService.getAll(), this.getFeesOnPage(tab.page)]);
    this.storageService.updateFees({ ...pageFees, ...onlineFees });
    await this.tabService.releaseTab(tab.id);
    return this.storageService.getFees();
  }

  async simulate(newSimulate: NewSimulate) {
    newSimulate = this.normalizeInput(newSimulate);
    this.logger.debug('simulate init');

    const tab = await this.tabService.getFreeTab();

    try {
      const fees = await this.getCurrentFees();

      await this.updateTextContent(tab.page, '#periodo', '0');

      await this.tryClick(tab.page, '.btn-reset');

      await this.updateTextContent(tab.page, '#taxa_selic', fees.selic.value);
      await this.updateTextContent(tab.page, '#taxa_cdi', fees.cdi.value);
      await this.updateTextContent(tab.page, '#ipca', fees.ipca.value);
      await this.updateTextContent(tab.page, '#tr', fees.tr.value);
      await this.updateTextContent(tab.page, '#taxa_poupanca', fees.poupanca.value);

      if (newSimulate.cdbReturn) {
        await this.updateTextContent(tab.page, '#rentab_cdb', newSimulate.cdbReturn);
        fees.rentabilidade.cdb.value = newSimulate.cdbReturn;
      }

      await this.updateTextContent(tab.page, '#investimento_inicial', newSimulate.initialValue);
      await this.updateTextContent(tab.page, '#aporte_iniciais', newSimulate.monthlyValue);
      await this.updateTextContent(tab.page, '#periodo', newSimulate.period);

      await this.tryClick(tab.page, '.disclaimer-inputs');
      await this.tryClick(tab.page, '.btn-calcular');

      await Promise.race([tab.page.waitForSelector('#result_cap_init'), delay(1000)]);

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

      if (
        this.hasDifferentValues(
          {
            initialValue: resultCapInit,
            monthlyValue: resultAporte,
            period: resultPeriodo,
          } as NewSimulate,
          newSimulate,
        )
      ) {
        throw new Error('simulation failed');
      }

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

      jsonResult.attributes = fees;
      await this.tabService.releaseTab(tab.id);
      return jsonResult;
    } catch (error) {
      this.logger.error(error);
      this.logger.debug('destroyTab');
      await this.tabService.destroyTab(tab.id);
      throw error;
    } finally {
      this.logger.debug('simulate finish');
    }
  }

  private async tryClick(page: Page, id: string) {
    try {
      await page.click(id);
    } catch {}
  }

  private async updateTextContent(page: Page, id: string, value: string) {
    const page_id = await page.waitForSelector(id);
    await page_id.evaluate((input) => (input.textContent = ''));
    await page_id.type(value, {
      delay: 1,
    });
  }

  normalizeInput(newSimulate: NewSimulate): NewSimulate {
    newSimulate.initialValue = convertCurrencyStringToNumber(newSimulate.initialValue);
    newSimulate.monthlyValue = convertCurrencyStringToNumber(newSimulate.monthlyValue);
    return newSimulate;
  }

  hasDifferentValues(result: NewSimulate, newSimulate: NewSimulate) {
    return (
      convertCurrencyStringToNumber(result.initialValue) != convertCurrencyStringToNumber(newSimulate.initialValue) ||
      convertCurrencyStringToNumber(result.monthlyValue) != convertCurrencyStringToNumber(newSimulate.monthlyValue) ||
      result.period.replace(/\D/g, '').trim() != newSimulate.period
    );
  }

  private async getFeesOnPage(page: Page) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selic, cdi, ipca, tr, tesouroPre, custodia, tesouroIpca, admFundoDi, rentabCdb, rentabFundoDi, rentabLciLca, poupanca] = await Promise.all([
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
      taxa: {
        custodia: {
          value: custodia,
          description: 'Taxa de custódia da B3 no Tesouro Direto (a.a.) %',
        },
        admFundoDi: {
          value: admFundoDi,
          description: 'Taxa de administração do Fundo DI (a.a.) %',
        },
      },
      juro: {
        tesouroPre: {
          description: 'Juro nominal do Tesouro Prefixado (a.a.) %',
          value: tesouroPre,
        },
        tesouroIpca: {
          value: tesouroIpca,
          description: 'Juro real do Tesouro IPCA+ (a.a.) %',
        },
      },
      rentabilidade: {
        cdb: {
          value: rentabCdb,
          description: 'Rentabilidade do CDB (% do CDI)',
        },
        fundoDi: {
          value: rentabFundoDi,
          description: 'Rentabilidade do Fundo DI (% do CDI)',
        },
        lciLca: {
          value: rentabLciLca,
          description: 'Rentabilidade da LCI/LCA (% do CDI)',
        },
      },
    } as OflineFees;
  }
}
