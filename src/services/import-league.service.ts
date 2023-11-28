import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ExternalApiService } from './external-api.service';
import {
  CoachDocumentInterface,
  CompetitionDocumentInterface,
  PlayerDocumentInterface,
  TeamDocumentInterface,
} from '../schemas';
import { LeagueCodeType } from '../types';
import {
  ApiResponseInterface,
  LeagueExtApiResInterface,
  SquadExtApiResInterface,
  TeamExtApiResInterface,
  TeamsAndPlayerExtApiResInterface,
} from '../interfaces';

@Injectable()
export class ImportLeagueService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    @InjectModel('Competition')
    private competitionModel: Model<CompetitionDocumentInterface>,
    @InjectModel('Team')
    private teamModel: Model<TeamDocumentInterface>,
    @InjectModel('Player')
    private playerModel: Model<PlayerDocumentInterface>,
    @InjectModel('Coach')
    private coachModel: Model<CoachDocumentInterface>,
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
        ...teamsAndPlayers.teams.map(async (team: TeamExtApiResInterface) => {
          await this.createTeams(leagueCode, team);
          await this.createPlayer(team);
          await this.createCoach(team);
        }),
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
    team: TeamExtApiResInterface,
  ): Promise<void> {
    const existingTeam = await this.teamModel
      .findOne({
        id: team.id,
      })
      .exec();

    if (existingTeam) {
      await this.teamModel.findOneAndUpdate(
        { id: team.id },
        { competitions: [...existingTeam.competitions, leagueCode] },
      );
    } else {
      await this.teamModel.create({
        id: team.id,
        name: team.name,
        tla: team.tla,
        shortName: team.shortName,
        areaName: team.area.name,
        address: team.address,
        competitions: [`${leagueCode}`],
      });
    }
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

  private async createPlayer(team: TeamExtApiResInterface): Promise<void> {
    team.squad.map(
      async ({
        id,
        name,
        position,
        dateOfBirth,
        nationality,
      }: SquadExtApiResInterface) => {
        const existingPlayer = await this.playerModel.findOne({ id }).exec();
        if (!existingPlayer) {
          await this.playerModel.create({
            id,
            name,
            position,
            dateOfBirth,
            nationality,
            team: team.id,
          });
        }
      },
    );
  }

  private async createCoach(team: TeamExtApiResInterface): Promise<void> {
    const existingCoach = await this.coachModel
      .findOne({ id: team.coach.id })
      .exec();
    if (!existingCoach) {
      const currentDate = new Date();
      const idRandom = currentDate.getTime() % Math.pow(10, 10);
      await this.coachModel.create({
        id: team.coach.id || idRandom,
        name: team.coach.name,
        dateOfBirth: team.coach.dateOfBirth,
        nationality: team.coach.nationality,
        team: team.id,
      });
    }
  }
}
