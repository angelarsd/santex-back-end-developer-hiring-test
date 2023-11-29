import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CoachDocumentInterface,
  PlayerDocumentInterface,
  TeamDocumentInterface,
} from '../schemas';
import {
  ApiResponseInterface,
  CoachResponseInterface,
  PlayerResponseInterface,
  TeamResponseInterface,
} from '../interfaces';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel('Team') private teamModel: Model<TeamDocumentInterface>,
    @InjectModel('Player') private playerModel: Model<PlayerDocumentInterface>,
    @InjectModel('Coach') private coachModel: Model<CoachDocumentInterface>,
  ) { }

  async findTeamByName(
    teamName: string,
    includePlayers = false,
  ): Promise<ApiResponseInterface | TeamResponseInterface> {
    const team = await this.teamModel
      .findOne({ name: { $regex: new RegExp(teamName, 'i') } })
      .select('-_id id name tla shortName areaName address competitions')
      .lean()
      .exec();

    if (!team) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not found',
          message: 'No team were found with the filters applied.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (includePlayers) {
      const playersOrCoach = await this.findPlayersOrCoachByTeamName(team.id);
      return { ...team, ...playersOrCoach };
    }

    return team;
  }

  private async findPlayersOrCoachByTeamName(teamId: number): Promise<{
    players?: PlayerResponseInterface[];
    coach?: CoachResponseInterface;
  }> {
    const players = (await this.playerModel
      .find({ team: teamId })
      .select('-_id id name position dateOfBirth nationality team')
      .exec()) as unknown as PlayerResponseInterface[];

    if (players.length) {
      return { players };
    }

    const coach = (await this.coachModel
      .findOne({ team: teamId })
      .select('-_id name dateOfBirth nationality team')
      .lean()
      .exec()) as unknown as CoachResponseInterface;

    return { coach };
  }
}
