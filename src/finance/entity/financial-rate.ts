import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import moment from 'moment';
import { DetailedValues } from '../interface/fees';

@Entity({ name: 'financial_rates' })
export class FinancialRate {
  @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
  rate_type: 'cdi' | 'di' | 'ipca' | 'poupanca' | 'selic' | 'tr';

  @Column({ type: 'numeric', nullable: false })
  value: number;

  @Column({ type: 'varchar', nullable: false, name: 'updated_at' })
  updatedAt: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false, name: 'updated_at_db' })
  updatedAtDb: Date;

  toDetailedValues(): DetailedValues {
    return {
      value: this.value,
      updatedAt: moment(this.updatedAt).format('DD/MM/YYYY'),
    };
  }
}
