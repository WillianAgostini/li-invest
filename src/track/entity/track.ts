import { DateTransformer } from 'src/transformer/date-transformer';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'access_count' })
  accessCount: number;

  @CreateDateColumn({ name: 'created_at', transformer: new DateTransformer() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', transformer: new DateTransformer() })
  updatedAt: Date;
}
