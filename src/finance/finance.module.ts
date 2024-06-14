import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { StorageService } from './storage/storage.service';
import { FeeService } from './fee/fee.service';
import { FinanceService } from './finance.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [FinanceService, StorageService, FeeService],
  exports: [FinanceService],
})
export class FinanceModule {}
