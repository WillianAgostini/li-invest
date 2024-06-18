import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment-dto';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Investment } from './entity/investment';
import { InvestmentMapper } from './mapper/investment.mapper';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
  ) {}

  getById(id: number): any {
    return this.investmentRepository.findOneBy({ id });
  }

  async getAll() {
    return this.investmentRepository.find();
  }

  async getByIdMapped(id: number) {
    return InvestmentMapper.toCreateInvestmentResultDto(await this.investmentRepository.findOneBy({ id }));
  }

  async getAllMapped() {
    return InvestmentMapper.toCreateInvestmentResultDtoArray(await this.investmentRepository.find());
  }

  async insert(createInvestmentDto: CreateInvestmentDto): Promise<InsertResult> {
    return this.investmentRepository.insert(createInvestmentDto);
  }

  async delete(id: number) {
    const entity = await this.investmentRepository.findBy({ id });
    if (!entity) throw new NotFoundException(`Investment with ID ${id} not found`);
    return this.investmentRepository.remove(entity);
  }
}
