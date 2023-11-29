import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ImportLeagueService } from './services/import-league.service';
import { PlayerService } from './services/player.service';
import { ValidateLeagueCodePipe } from './decorators';
import { LeagueCodeType } from './types';
import {
  ApiResponseInterface,
  PlayersResponseInterface,
  TeamResponseInterface,
} from './interfaces';
import { TeamService } from './services/team.service';
import { FetchPlayersDoc, ImportLeagueDoc, FetchTeamDoc } from './swagger';

@Controller()
export class AppController {
  constructor(
    private readonly importLeagueService: ImportLeagueService,
    private readonly playerService: PlayerService,
    private readonly teamService: TeamService,
  ) { }

  @Post('importLeague')
  @ImportLeagueDoc()
  async importLeague(
    @Body('leagueCode', ValidateLeagueCodePipe) leagueCode: LeagueCodeType,
  ): Promise<ApiResponseInterface> {
    return this.importLeagueService.fetchAndSaveData(leagueCode);
  }

  @Get('players/:leagueCode')
  @FetchPlayersDoc()
  async fetchPlayers(
    @Param('leagueCode', ValidateLeagueCodePipe) leagueCode: LeagueCodeType,
    @Query() queries: { name?: string },
  ): Promise<PlayersResponseInterface[] | ApiResponseInterface> {
    return this.playerService.getPlayersByCompetition(leagueCode, queries);
  }

  @Get('team/:teamName')
  @FetchTeamDoc()
  async fetchTeam(
    @Param('teamName') teamName: string,
    @Query()
    queries: {
      includePlayers?: string;
    },
  ): Promise<TeamResponseInterface | ApiResponseInterface> {
    const includePlayers = queries.includePlayers === 'true';
    return this.teamService.findTeamByName(teamName, includePlayers);
  }
}
