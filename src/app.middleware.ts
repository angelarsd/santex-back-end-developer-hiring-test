// Importa las dependencias necesarias
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class AppRateLimitMiddleware implements NestMiddleware {
  private limiter;

  constructor() {
    this.limiter = new RateLimiterMemory({
      points: 5,
      duration: 1,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.limiter.consume(req.ip);
      next();
    } catch (_e) {
      res.status(HttpStatus.TOO_MANY_REQUESTS).send({
        status: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message:
          'You have exceeded the allowed rate limit for this endpoint. Please try again later.',
      });
    }
  }
}
