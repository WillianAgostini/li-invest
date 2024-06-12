import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DetailedValues, OnlineFees } from '../storage/storage.service';

@Injectable()
export class FeeService {
  constructor(private readonly httpService: HttpService) {}

  async getAll() {
    const cdi = await this.getCdi();
    const ipca = await this.getIpca();
    const selic = await this.getSelicMeta();
    const poupanca = await this.getPoupanca();
    const tr = await this.getTr();
    return {
      cdi,
      ipca,
      selic,
      poupanca,
      tr,
    } as OnlineFees;
  }

  async getPoupanca() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json'));
    const value = data[0].valor;
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
      description: 'Rentabilidade da Poupança (a.m.) %',
    } as DetailedValues;
  }

  async getSelicOver() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1178/dados/ultimos/1?formato=json'));
    const value = data[0].valor;
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
    };
  }

  async getSelicMeta() {
    const { data } = await firstValueFrom(this.httpService.get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros'));
    const value = data.conteudo[0].MetaSelic;
    const today = new Date();
    const updatedAt = `${today.getDay()}/${today.getMonth()}/${today.getFullYear()}`;

    return {
      value,
      updatedAt,
      description: 'SELIC meta (a.a.) %',
    } as DetailedValues;
  }

  async getCdi() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json'));
    const value = data[0].valor;
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
      description: 'CDI (a.a.) %',
    } as DetailedValues;
  }

  async getIpca() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/ExpectativasMercadoInflacao12Meses?$top=1&$format=json&$select=Indicador,Data,Suavizada,Mediana,baseCalculo&$filter=Indicador%20eq%20%27IPCA%27%20and%20baseCalculo%20eq%200%20and%20Suavizada%20eq%20%27S%27&$orderby=Data%20desc',
      ),
    );
    const value = data.value[0].Mediana;
    const updatedAt = data.value[0].Data;
    return {
      value,
      updatedAt,
      description: 'IPCA (a.a.) %',
    } as DetailedValues;
  }

  async getTr() {
    const { data } = await firstValueFrom(this.httpService.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados/ultimos/1?formato=json'));
    const value = data[0].valor;
    const updatedAt = data[0].data;
    return {
      value,
      updatedAt,
      description: 'Taxa Referencial (a.m.) %',
    } as DetailedValues;
  }
}
