import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  LeagueExtApiResInterface,
  TeamsAndPlayerExtApiResInterface,
} from './interfaces';
import { LeagueCodeType } from './types';

@Injectable()
export class ExternalApiService {
  private readonly service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: process.env.EXTERNAL_API_URL,
      headers: {
        'X-Auth-Token': process.env.EXTERNAL_API_KEY,
      },
    });
  }

  async fetchCompetitionDetails(
    leagueCode: LeagueCodeType,
  ): Promise<LeagueExtApiResInterface> {
    const response = await this.service.get(`competitions/${leagueCode}`);
    return response.data;
  }

  async fetchTeamsAndPlayers(
    leagueCode: LeagueCodeType,
  ): Promise<TeamsAndPlayerExtApiResInterface> {
    const response = await this.service.get(`competitions/${leagueCode}/teams`);
    return response.data;
  }
}
