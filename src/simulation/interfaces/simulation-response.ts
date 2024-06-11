export interface SimulationResponse {
  responseStatus: number;
  responseStatusText: string;
  statusInfo: string;
  response: Response;
}

export interface Response {
  BizSts: BizSts;
  Smltn: Smltn;
  SmltnTrsrBdList: SmltnTrsrBdList[];
  TrsrBdQtnList: TrsrBdQtnList[];
  TrsrBdTradgList: TrsrBdTradgList2[];
  SmltnTrsrBd: any;
  AsstList: any[];
  FinIndxsList: any[];
}

export interface BizSts {
  cd: string;
  cmpvDesc: any;
  dtTm: string;
}

export interface Smltn {
  TrsrBd: TrsrBd;
  invdInitlVal: number;
  mnthlyCntrbtnAmt: any;
  mnthlyCntrbtnQty: number;
  invdAmt: number;
  grssRedAmt: any;
}

export interface TrsrBd {
  cd: number;
  nm: string;
  mtrtyDt: string;
  proftBdFee: any;
}

export interface SmltnTrsrBdList {
  TrsrBd: TrsrBd2;
  unqInvstmtVal: number;
  mnthlyTtl: any;
  grssAmt: number;
  anulInvstmtRate: number;
  ctdyFee: number;
  ptyFee: number;
  evsIncmTax: number;
  netAmt: number;
  netPfb: number;
  mnthlyTtlInf: any;
}

export interface TrsrBd2 {
  nm: string;
}

export interface TrsrBdQtnList {
  dt: string;
  TrsrBdTradgList: TrsrBdTradgList[];
}

export interface TrsrBdTradgList {
  TrsrBd: TrsrBd3;
  grssAmt: number;
}

export interface TrsrBd3 {
  nm: string;
}

export interface TrsrBdTradgList2 {
  TrsrBd: TrsrBd4;
  netPrb: number;
}

export interface TrsrBd4 {
  nm: string;
}
