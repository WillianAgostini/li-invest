import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import privacyPolicies from '../view/privacyPolicies';
import termsAndConditions from '../view/termsAndConditions';

@Controller('regulations')
@ApiTags('regulations')
export class RegulationsController {
  @Get('privacyPolicies')
  @ApiResponse({ status: 200 })
  async getPrivacyPolicies() {
    return privacyPolicies;
  }

  @Get('termsAndConditions')
  @ApiResponse({ status: 200 })
  async getTermsAndConditions() {
    return termsAndConditions;
  }
}
