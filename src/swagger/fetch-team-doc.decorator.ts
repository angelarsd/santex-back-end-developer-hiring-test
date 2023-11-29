import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiResponseInterface, PlayersResponseInterface } from 'src/interfaces';

export const FetchTeamDoc = () =>
  applyDecorators(
    ApiOperation({ description: 'Method to fetch team by name' }),
    ApiQuery({ name: 'includePlayers', required: false, type: String }),
    ApiParam({ name: 'teamName', type: String }),
    ApiOkResponse({ status: 200, type: PlayersResponseInterface }),
    ApiConflictResponse({ status: 409, type: ApiResponseInterface }),
    ApiInternalServerErrorResponse({ status: 500, type: ApiResponseInterface }),
  );
