import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DetailedValues } from '../interface/fees';
import moment from 'moment';
import { convertToBr } from 'src/utils/conveter';

@Injectable()
export class FeeService {
  private readonly logger = new Logger(FeeService.name);

  constructor(private readonly httpService: HttpService) {}

  async getPoupanca(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json'));
      const value = parseFloat(data?.at(0)?.valor);
      const updatedAt = convertToBr(data?.at(0)?.data, 'DD/MM/YYYY');
      return {
        value,
        updatedAt,
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getSelicOver(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados/ultimos/1?formato=json'));
      const value = parseFloat(data?.at(0)?.valor);
      const updatedAt = convertToBr(data?.at(0)?.data, 'DD/MM/YYYY');
      return {
        value,
        updatedAt,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getSelicMeta(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros'));
      const value = parseFloat(data.conteudo?.at(0)?.MetaSelic);
      const today = new Date();
      const updatedAt = convertToBr(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, 'DD/MM/YYYY');

      return {
        value,
        updatedAt,
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getIpca(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoInflacao12Meses?$top=1&$format=json&$select=Indicador,Data,Suavizada,Mediana,baseCalculo&$filter=Indicador%20eq%20%27IPCA%27%20and%20baseCalculo%20eq%200%20and%20Suavizada%20eq%20%27S%27&$orderby=Data%20desc',
        ),
      );
      const value = parseFloat(data.value?.at(0)?.Mediana);
      const updatedAt = convertToBr(data.value?.at(0)?.Data, 'YYYY-MM-DD');
      return {
        value,
        updatedAt,
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getTr(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados/ultimos/1?formato=json'));
      const value = parseFloat(data?.at(0)?.valor);
      const updatedAt = convertToBr(data?.at(0)?.data, 'DD/MM/YYYY');
      return {
        value,
        updatedAt,
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getDolar(): Promise<DetailedValues | undefined> {
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
          value,
          updatedAt,
        } as DetailedValues;
      } catch (error) {
        this.logger.error(`Error fetching USD rate for ${today}: ${error.message}`);
        attempts++;
      }
    }

    return undefined;
  }
}
