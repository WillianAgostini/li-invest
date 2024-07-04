import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, InsertResult, Repository } from 'typeorm';
import { CreateInvestmentDto } from '../dto/create-investment-dto';
import { Investment } from '../entities/investment';
import { InvestmentMapper } from '../mapper/investment.mapper';

@Injectable()
export class InvestmentRepository {
  private readonly investmentRepository: Repository<Investment>;

  constructor(private dataSource: DataSource) {
    this.investmentRepository = this.dataSource.getRepository(Investment);
  }

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
