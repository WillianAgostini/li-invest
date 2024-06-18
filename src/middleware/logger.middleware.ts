import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const urlLog = `${req.method} - ${req.originalUrl}`;
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];

    if (methodsWithBody.includes(req.method)) {
      this.logger.debug(urlLog, req.body);
    } else {
      this.logger.debug(urlLog);
    }

    if (next) {
      next();
    }
  }
}
