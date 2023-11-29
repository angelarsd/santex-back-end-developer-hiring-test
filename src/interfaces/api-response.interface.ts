import { HttpStatus } from '@nestjs/common';

export class ApiResponseInterface {
  status: HttpStatus;
  error?: string;
  message: string;
  data?: unknown;
}
