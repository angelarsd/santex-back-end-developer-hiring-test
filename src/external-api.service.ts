import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

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

  /* TODO:
    WC | FIFA World Cup
    CL | UEFA Champions League
    BL1 | Bundesliga
    DED | Eredivisie
    BSA | Campeonato Brasileiro Série A
    PD | Primera Division
    FL1 | Ligue 1
    ELC | Championship
    PPL | Primeira Liga
    EC | European Championship
    SA | Serie A
    PL | Premier League
    CLI | Copa Libertadores
  */

  async fetchCompetitionDetails(competitionId: string): Promise<any> {
    const response = await this.service.get(`competitions/${competitionId}`);
    return response.data;
  }

  async fetchTeamsAndPlayers(competitionId: string): Promise<any> {
    const response = await this.service.get(
      `competitions/${competitionId}/teams`,
    );
    return response.data;
  }
}
