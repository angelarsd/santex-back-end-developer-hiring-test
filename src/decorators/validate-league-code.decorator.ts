import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { LeagueCodeType, TLeagueCodeType } from '../types';

@Injectable()
export class ValidateLeagueCodePipe implements PipeTransform<string, string> {
  transform(leagueCode: LeagueCodeType): string {
    const allowedCodes = Object.values(TLeagueCodeType);
    const allowedCodesText = allowedCodes.join(', ');

    if (!allowedCodes.includes(leagueCode)) {
      throw new BadRequestException(
        `Invalid value for leagueCode. Allowed values are: ${allowedCodesText}`,
      );
    }

    return leagueCode;
  }
}
