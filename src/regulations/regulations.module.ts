import { Module } from '@nestjs/common';
import { RegulationsController } from './controllers/regulations.controller';

@Module({
  imports: [],
  controllers: [RegulationsController],
  providers: [],
  exports: [],
})
export class RegulationsModule {}
