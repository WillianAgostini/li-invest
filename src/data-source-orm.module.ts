import { Global, Logger, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Investment } from './investment/entities/investment';
import { FinancialRate } from './simulation/entities/financial-rate';
import dotenv from 'dotenv';
dotenv.config();

const appDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [FinancialRate, Investment],
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
          // throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DataSourceOrmModule {}
