import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ExternalApiService } from './external-api.service';
import { CoachDto, CompetitionDto, PlayerDto, TeamDto } from './schemas';
import { LeagueCodeType } from './types';
import {
  ApiResponseInterface,
  LeagueExtApiResInterface,
  SquadExtApiResInterface,
  TeamExtApiResInterface,
  TeamsAndPlayerExtApiResInterface,
} from './interfaces';

@Injectable()
export class ImportLeagueService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    @InjectModel('Competition')
    private competitionModel: Model<CompetitionDto>,
    @InjectModel('Team')
    private teamModel: Model<TeamDto>,
    @InjectModel('Player')
    private playerModel: Model<PlayerDto>,
    @InjectModel('Coach')
    private coachModel: Model<CoachDto>,
  ) { }

  async fetchAndSaveData(
    leagueCode: LeagueCodeType,
  ): Promise<ApiResponseInterface> {
    await this.checkExistingCompetition(leagueCode);

    try {
      const [competition, teamsAndPlayers] = await Promise.all([
        this.externalApiService.fetchCompetitionDetails(leagueCode),
        this.externalApiService.fetchTeamsAndPlayers(leagueCode),
      ]);

      await Promise.all([
        this.createCompetition(competition),
        this.createTeams(leagueCode, teamsAndPlayers),
        this.createPlayersOrCoach(teamsAndPlayers),
      ]);

      return {
        status: HttpStatus.CREATED,
        message: 'Resource created successfully',
        data: {
          name: competition.name,
          code: competition.code,
          areaName: competition.area.name,
        },
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createCompetition({
    name,
    code,
    area,
  }: LeagueExtApiResInterface): Promise<void> {
    await this.competitionModel.create({
      name,
      code,
      areaName: area.name,
    });
  }

  private async createTeams(
    leagueCode: LeagueCodeType,
    teamsAndPlayers: TeamsAndPlayerExtApiResInterface,
  ): Promise<void> {
    await Promise.all(
      teamsAndPlayers.teams.map(async (team: TeamExtApiResInterface) => {
        const existingTeam = await this.existingTeam(team);

        if (existingTeam) {
          await this.teamModel.findOneAndUpdate(
            { tla: team.tla },
            { competitions: [...existingTeam.competitions, leagueCode] },
          );
        }

        await this.teamModel.create({
          name: team.name,
          tla: team.tla,
          shortName: team.shortName,
          areaName: team.area.name,
          address: team.address,
          competitions: [`${leagueCode}`],
        });
      }),
    );
  }

  private async createPlayersOrCoach(
    teamsAndPlayers: TeamsAndPlayerExtApiResInterface,
  ): Promise<void> {
    await Promise.all(
      teamsAndPlayers.teams.map(async (team: TeamExtApiResInterface) => {
        if (team.squad.length) {
          this.createPlayer(team);
        } else {
          this.createCoach(team);
        }
      }),
    );
  }

  private async checkExistingCompetition(leagueCode: LeagueCodeType) {
    const existingCompetition = await this.competitionModel
      .findOne({ code: leagueCode })
      .exec();

    if (existingCompetition) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: 'The league has already been imported previously.',
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  private async existingTeam(
    team: TeamExtApiResInterface,
  ): Promise<TeamDto | null> {
    return await this.teamModel.findOne({
      tla: team.tla,
    });
  }

  private async createPlayer(team: TeamExtApiResInterface): Promise<void> {
    const existingTeam = await this.existingTeam(team);
    if (!existingTeam) {
      team.squad.map(
        async ({
          id,
          name,
          position,
          dateOfBirth,
          nationality,
        }: SquadExtApiResInterface) =>
          await this.playerModel.create({
            id,
            name,
            position,
            dateOfBirth,
            nationality,
            team: team.tla,
          }),
      );
    }
  }

  private async createCoach(team: TeamExtApiResInterface): Promise<void> {
    await this.coachModel.create({
      name: team.coach.name,
      dateOfBirth: team.coach.dateOfBirth,
      nationality: team.coach.nationality,
      team: team.tla,
    });
  }
}
