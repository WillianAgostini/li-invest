export interface DetailedValues {
  value: number;
  updatedAt?: string;
  description: string;
}

export interface Fees {
  di: DetailedValues;
  tr: DetailedValues;
  ipca: DetailedValues;
  cdi: DetailedValues;
  selic: DetailedValues;
  poupanca: DetailedValues;
}
