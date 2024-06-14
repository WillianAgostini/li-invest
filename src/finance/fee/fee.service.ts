import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DetailedValues } from '../interface/fees';

@Injectable()
export class FeeService {
  private readonly logger = new Logger(FeeService.name);

  constructor(private readonly httpService: HttpService) {}

  async getDi(): Promise<DetailedValues | undefined> {
    try {
      // const { data } = await firstValueFrom(this.httpService.get('https://www2.cetip.com.br/ConsultarTaxaDi/ConsultarTaxaDICetip.aspx'));
      // const value = parseFloat(data.taxa.replace(/[.]/g, '').replace(',', '.'));
      // const updatedAt = data[0].data;
      return {
        value: 10,
        updatedAt: new Date().toString(),
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getPoupanca(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json'));
      const value = parseFloat(data[0].valor);
      const updatedAt = data[0].data;
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
      const value = parseFloat(data[0].valor);
      const updatedAt = data[0].data;
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
      const value = parseFloat(data.conteudo[0].MetaSelic);
      const today = new Date();
      const updatedAt = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

      return {
        value,
        updatedAt,
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getCdi(): Promise<DetailedValues | undefined> {
    try {
      const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json'));
      const value = parseFloat(data[0].valor);
      const updatedAt = data[0].data;
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
      const value = parseFloat(data.value[0].Mediana);
      const updatedAt = data.value[0].Data;
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
      const value = parseFloat(data[0].valor);
      const updatedAt = data[0].data;
      return {
        value,
        updatedAt,
      } as DetailedValues;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
