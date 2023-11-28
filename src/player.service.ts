import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeagueCodeType } from './types';
import { PlayerDto } from './schemas';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Player')
    private playerModel: Model<PlayerDto>,
  ) { }

  async getPlayersByCompetition(
    leagueCode: LeagueCodeType,
    { name }: { name?: string },
  ): Promise<any> {
    const playersInCompetition = await this.playerModel.aggregate([
      {
        $lookup: {
          from: 'teams',
          localField: 'team',
          foreignField: 'tla',
          as: 'teamDetails',
        },
      },
      {
        $unwind: '$teamDetails',
      },
      {
        $lookup: {
          from: 'competitions',
          localField: 'teamDetails.competitions',
          foreignField: 'code',
          as: 'competitionDetails',
        },
      },
      {
        $unwind: '$competitionDetails',
      },
      {
        $match: {
          'competitionDetails.code': leagueCode,
          name: name ? { $regex: new RegExp(name, 'i') } : { $exists: true },
        },
      },
      {
        $project: {
          name: 1,
          position: 1,
          dateOfBirth: 1,
          nationality: 1,
          team: '$teamDetails.name',
        },
      },
    ]);

    return playersInCompetition;
  }
}
