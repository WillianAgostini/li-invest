import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment';
import { InvestmentController } from './controllers/investment.controller';
import { InvestmentRepository } from './repositories/investment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Investment])],
  controllers: [InvestmentController],
  providers: [InvestmentRepository],
  exports: [InvestmentRepository],
})
export class InvestmentModule {}
