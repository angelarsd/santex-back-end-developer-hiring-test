import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeagueCodeType } from '../types';
import { PlayerDocumentInterface } from '../schemas';
import { ApiResponseInterface, PlayersResponseInterface } from '../interfaces';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Player')
    private playerModel: Model<PlayerDocumentInterface>,
  ) { }

  async getPlayersByCompetition(
    leagueCode: LeagueCodeType,
    { name }: { name?: string },
  ): Promise<PlayersResponseInterface[] | ApiResponseInterface> {
    const playersInCompetition = (await this.playerModel.aggregate([
      {
        $lookup: {
          from: 'teams',
          localField: 'team',
          foreignField: 'id',
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
          _id: 0,
          id: 1,
          name: 1,
          position: 1,
          dateOfBirth: 1,
          nationality: 1,
          team: '$teamDetails.name',
        },
      },
    ])) as unknown as PlayersResponseInterface[];

    if (!playersInCompetition.length) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not found',
          message: 'No players were found with the filters applied.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return playersInCompetition;
  }
}
