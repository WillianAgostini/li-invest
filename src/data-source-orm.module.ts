import { DataSource } from 'typeorm';
import { Global, Logger, Module } from '@nestjs/common';
import { Investment } from './investment/entities/investment';
import { FinancialRate } from './simulation/entities/financial-rate';
import { Track } from './track/entities/track';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'postgres',
          port: 5432,
          host: process.env.DATABASE_HOST,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          ssl: { rejectUnauthorized: false },
          entities: [FinancialRate, Investment, Track],
        });
        try {
          if (!dataSource.isInitialized) {
            Logger.debug('Database connected successfully', DataSourceOrmModule.name);
            await dataSource.initialize();
          }
        } catch (error) {
          Logger.error(error, DataSourceOrmModule.name);
        }
        return dataSource;
      },
    },
  ],
  exports: [DataSource],
})
export class DataSourceOrmModule {}
