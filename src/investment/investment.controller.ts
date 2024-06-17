import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInvestmentDto, CreateInvestmentDtoResult } from './dto/create-investment-dto';
import { InvestmentService } from './investment.service';

@ApiTags('investment')
@Controller('investment')
export class InvestmentController {
  private readonly logger = new Logger(InvestmentController.name);

  constructor(private investmentService: InvestmentService) {}

  @Get()
  @ApiResponse({ status: 200, type: [CreateInvestmentDtoResult] })
  async get() {
    try {
      return await this.investmentService.getAll();
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }

  @Post()
  @ApiBody({ type: CreateInvestmentDto })
  @ApiResponse({ status: 201 })
  async post(@Body() createInvestmentDto: CreateInvestmentDto): Promise<void> {
    try {
      this.logger.debug(createInvestmentDto, 'createInvestmentDto');
      await this.investmentService.insert(createInvestmentDto);
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404 })
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this.investmentService.delete(id);
    } catch (error) {
      throw new Error('exception ' + error?.message);
    }
  }
}
