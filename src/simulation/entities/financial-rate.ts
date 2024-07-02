import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import moment from 'moment';
import { DetailedValues } from '../interface/fees';
import { DateTransformer } from 'src/transformer/date-transformer';

export enum RateType {
  CDI = 'cdi',
  IPCA = 'ipca',
  POUPANCA = 'poupanca',
  SELIC = 'selic',
  TR = 'tr',
  USD = 'usd',
}

@Entity({ name: 'financial_rates' })
export class FinancialRate {
  @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
  rate_type: RateType;

  @Column({ type: 'numeric', nullable: false })
  value: number;

  @Column({ type: 'varchar', nullable: false, name: 'updated_at' })
  updatedAt: string;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP', nullable: false, name: 'updated_at_db', transformer: new DateTransformer() })
  updatedAtDb: Date;

  toDetailedValues(): DetailedValues {
    return {
      value: this.value,
      updatedAt: moment(this.updatedAt).format('DD/MM/YYYY'),
    };
  }
}
