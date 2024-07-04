import { Global, Logger, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Investment } from './investment/entities/investment';
import { FinancialRate } from './simulation/entities/financial-rate';
import { Track } from './track/entities/track';

const appDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [FinancialRate, Investment, Track],
});

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          if (!appDataSource.isInitialized) {
            Logger.debug('Database connected successfully', DataSourceOrmModule.name);
            await appDataSource.initialize();
            return appDataSource;
          }
        } catch (error) {
          Logger.error(error, DataSourceOrmModule.name);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DataSourceOrmModule {}
