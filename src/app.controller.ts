import { Controller, Post, Body } from '@nestjs/common';
import { ImportLeagueService } from './import-league.service';
import { AppService } from './app.service';
import { ValidateLeagueCodePipe } from './decorators';
import { LeagueCodeType } from './types';
import { ApiResponseInterface } from './interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly importLeagueService: ImportLeagueService,
    private readonly appService: AppService,
  ) { }

  @Post('importLeague')
  async importLeague(
    @Body('leagueCode', ValidateLeagueCodePipe) leagueCode: LeagueCodeType,
  ): Promise<ApiResponseInterface> {
    return this.importLeagueService.fetchAndSaveData(leagueCode);
  }
}
