import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/skip-auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (skipAuth) {
      return true;
    }

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
