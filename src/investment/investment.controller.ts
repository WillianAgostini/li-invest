import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInvestmentDto, CreateInvestmentResultDto } from './dto/create-investment-dto';
import { InvestmentService } from './investment.service';

@ApiTags('investment')
@Controller('investment')
export class InvestmentController {
  private readonly logger = new Logger(InvestmentController.name);

  constructor(private investmentService: InvestmentService) {}

  @Get()
  @ApiResponse({ status: 200, type: [CreateInvestmentResultDto] })
  async get() {
    return await this.investmentService.getAllMapped();
  }

  @Post()
  @ApiBody({ type: CreateInvestmentDto })
  @ApiResponse({ status: 201 })
  async post(@Body() createInvestmentDto: CreateInvestmentDto): Promise<void> {
    await this.investmentService.insert(createInvestmentDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404 })
  async delete(@Param('id') id: number): Promise<void> {
    await this.investmentService.delete(id);
  }
}
