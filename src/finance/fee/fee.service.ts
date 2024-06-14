import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DetailedValues, Fees } from '../interface/fees';

@Injectable()
export class FeeService {
  constructor(private readonly httpService: HttpService) {}

  async getAll() {
    const [di, tr, cdi, ipca, selic, poupanca] = await Promise.all([
      this.getDi(),
      this.getTr(),
      this.getCdi(),
      this.getIpca(),
      this.getSelicOver(),
      this.getPoupanca(),
    ]);

    return {
      di,
      tr,
      cdi,
      ipca,
      selic,
      poupanca,
    } as Fees;
  }

  async getDi() {
    // const { data } = await firstValueFrom(this.httpService.get('https://www2.cetip.com.br/ConsultarTaxaDi/ConsultarTaxaDICetip.aspx'));
    // const value = parseFloat(data.taxa.replace(/[.]/g, '').replace(',', '.'));
    // const updatedAt = data[0].data;
    return {
      value: 10,
      updatedAt: new Date().toString(),
    } as DetailedValues;
  }

  async getPoupanca() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json'));
    const value = parseFloat(data[0].valor);
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
    } as DetailedValues;
  }

  async getSelicOver() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados/ultimos/1?formato=json'));
    const value = parseFloat(data[0].valor);
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
    };
  }

  async getSelicMeta() {
    const { data } = await firstValueFrom(this.httpService.get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros'));
    const value = parseFloat(data.conteudo[0].MetaSelic);
    const today = new Date();
    const updatedAt = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    return {
      value,
      updatedAt,
    } as DetailedValues;
  }

  async getCdi() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json'));
    const value = parseFloat(data[0].valor);
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
    } as DetailedValues;
  }

  async getIpca() {
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
  }

  async getTr() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados/ultimos/1?formato=json'));
    const value = parseFloat(data[0].valor);
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
    } as DetailedValues;
  }
}
