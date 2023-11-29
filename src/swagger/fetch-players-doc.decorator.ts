import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiResponseInterface } from '../interfaces';

export const FetchPlayersDoc = () =>
  applyDecorators(
    ApiOperation({ description: 'Method to fetch players by leagueCode' }),
    ApiQuery({ name: 'name', required: false, type: String }),
    ApiParam({ name: 'leagueCode', type: String }),
    ApiOkResponse({ status: 200, type: ApiResponseInterface }),
    ApiConflictResponse({ status: 409, type: ApiResponseInterface }),
    ApiInternalServerErrorResponse({ status: 500, type: ApiResponseInterface }),
  );
