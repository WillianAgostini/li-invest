import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestmentDto, CreateInvestmentDtoResult } from './dto/create-investment-dto';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Investment } from './entity/investment';

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
    return this.investmentRepository.find() as Promise<CreateInvestmentDtoResult[]>;
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
