import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractTokenFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException();
    }

    return apiKey == process.env.API_KEY;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['x-api-key'] as string | undefined;
  }
}
