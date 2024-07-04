import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import privacyPolicies from '../view/privacyPolicies';
import termsAndConditions from '../view/termsAndConditions';
import { SkipAuth } from 'src/decorator/skip-auth.decorator';

@Controller('regulations')
@ApiTags('regulations')
export class RegulationsController {
  @SkipAuth()
  @Get('privacyPolicies')
  @ApiResponse({ status: 200 })
  async getPrivacyPolicies() {
    return privacyPolicies;
  }

  @SkipAuth()
  @Get('termsAndConditions')
  @ApiResponse({ status: 200 })
  async getTermsAndConditions() {
    return termsAndConditions;
  }
}
