import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ApiResponseInterface } from '../interfaces';

class PayloadInterface {
  leagueCode: string;
}

export const ImportLeagueDoc = () =>
  applyDecorators(
    ApiOperation({ description: 'Method to import League' }),
    ApiBody({
      type: PayloadInterface,
      examples: { payload: { value: '{ "leagueCode": "CL" }' } },
    }),
    ApiCreatedResponse({ status: 201, type: ApiResponseInterface }),
    ApiConflictResponse({ status: 409, type: ApiResponseInterface }),
    ApiInternalServerErrorResponse({ status: 500, type: ApiResponseInterface }),
  );
