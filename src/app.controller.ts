import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ImportLeagueService } from './services/import-league.service';
import { PlayerService } from './services/player.service';
import { ValidateLeagueCodePipe } from './decorators';
import { LeagueCodeType } from './types';
import { ApiResponseInterface, TeamResponseInterface } from './interfaces';
import { TeamService } from './services/team.service';

@Controller()
export class AppController {
  constructor(
    private readonly importLeagueService: ImportLeagueService,
    private readonly playerService: PlayerService,
    private readonly teamService: TeamService,
  ) { }

  @Post('importLeague')
  async importLeague(
    @Body('leagueCode', ValidateLeagueCodePipe) leagueCode: LeagueCodeType,
  ): Promise<ApiResponseInterface> {
    return this.importLeagueService.fetchAndSaveData(leagueCode);
  }

  @Get('players/:leagueCode')
  async fetchPlayers(
    @Param('leagueCode', ValidateLeagueCodePipe) leagueCode: LeagueCodeType,
    @Query() queries: { name?: string },
  ): Promise<any> {
    return this.playerService.getPlayersByCompetition(leagueCode, queries);
  }

  @Get('team/:teamName')
  async fetchTeam(
    @Param('teamName') teamName: string,
    @Query()
    queries: {
      includePlayers?: string;
    },
  ): Promise<ApiResponseInterface | TeamResponseInterface> {
    const includePlayers = queries.includePlayers === 'true';
    return this.teamService.findTeamByName(teamName, includePlayers);
  }
}
