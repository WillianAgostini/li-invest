import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import moment from 'moment';
import { convertToBr } from 'src/utils/conveter';
import { FinancialRate, RateType } from '../entities/financial-rate';

@Injectable()
export class FeeService {
  private readonly logger = new Logger(FeeService.name);

  constructor(private readonly httpService: HttpService) { }

  async getSelicOver(): Promise<FinancialRate | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados/ultimos/1?formato=json'));
      const value = parseFloat(data?.at(0)?.valor);
      const updatedAt = convertToBr(data?.at(0)?.data, 'DD/MM/YYYY');
      return {
        rate_type: RateType.CDI,
        value,
        updatedAt,
      } as FinancialRate;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getSelicMeta(): Promise<FinancialRate | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros'));
      const value = parseFloat(data.conteudo?.at(0)?.MetaSelic);
      const today = new Date();
      const updatedAt = convertToBr(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, 'DD/MM/YYYY');

      return {
        rate_type: RateType.SELIC,
        value,
        updatedAt,
      } as FinancialRate;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getIpca(): Promise<FinancialRate | undefined> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoInflacao12Meses?$top=1&$format=json&$select=Indicador,Data,Suavizada,Mediana,baseCalculo&$filter=Indicador%20eq%20%27IPCA%27%20and%20baseCalculo%20eq%200%20and%20Suavizada%20eq%20%27S%27&$orderby=Data%20desc',
        ),
      );
      const value = parseFloat(data.value?.at(0)?.Mediana);
      const updatedAt = convertToBr(data.value?.at(0)?.Data, 'YYYY-MM-DD');
      return {
        rate_type: RateType.IPCA,
        value,
        updatedAt,
      } as FinancialRate;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getDolar(): Promise<FinancialRate | undefined> {
    let attempts = 0;
    const maxAttempts = 3;
    let today = moment().add(1, 'day').format('MM-DD-YYYY');

    while (attempts < maxAttempts) {
      try {
        today = moment().subtract(attempts, 'days').format('MM-DD-YYYY');
        const { data } = await firstValueFrom(
          this.httpService.get(
            `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaAberturaOuIntermediario(codigoMoeda=@codigoMoeda,dataCotacao=@dataCotacao)?@codigoMoeda='USD'&@dataCotacao='${today}'&$format=json`,
          ),
        );
        if (!data?.value?.at(0)?.dataHoraCotacao) {
          attempts++;
          continue;
        }
        const value = parseFloat(data.value?.at(0)?.cotacaoCompra);
        const updatedAt = convertToBr(data.value?.at(0)?.dataHoraCotacao, 'YYYY-MM-DD');
        return {
          rate_type: RateType.USD,
          value,
          updatedAt,
        } as FinancialRate;
      } catch (error) {
        this.logger.error(`Error fetching USD rate for ${today}: ${error.message}`);
        attempts++;
      }
    }

    return undefined;
  }
}
