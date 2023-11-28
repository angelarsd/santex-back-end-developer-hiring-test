import { HttpStatus } from '@nestjs/common';

export interface ApiResponseInterface {
  status: HttpStatus;
  error?: string;
  message: string;
  data?: unknown;
}
