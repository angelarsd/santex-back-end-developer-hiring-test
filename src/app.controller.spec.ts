import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getModelToken } from '@nestjs/mongoose';
import {
  ExternalApiService,
  ImportLeagueService,
  PlayerService,
  TeamService,
} from './services';
import { PlayersResponseInterface } from './interfaces';

describe('AppController', () => {
  let controller: AppController;
  let importLeagueService: ImportLeagueService;
  let playerService: PlayerService;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ImportLeagueService,
        ExternalApiService,
        PlayerService,
        TeamService,
        { provide: getModelToken('Competition'), useValue: {} },
        { provide: getModelToken('Team'), useValue: {} },
        { provide: getModelToken('Player'), useValue: {} },
        { provide: getModelToken('Coach'), useValue: {} },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    importLeagueService = module.get<ImportLeagueService>(ImportLeagueService);
    playerService = module.get<PlayerService>(PlayerService);
    teamService = module.get<TeamService>(TeamService);
  });

  describe('importLeague', () => {
    it('should create a new competition', async () => {
      const competitionData = {
        status: 201,
        message: 'Resource created successfully',
        data: {
          name: 'UEFA Champions League',
          code: 'CL',
          areaName: 'Europe',
        },
      };

      jest
        .spyOn(importLeagueService, 'fetchAndSaveData')
        .mockImplementation(async () => competitionData);

      expect(await controller.importLeague('CL')).toBe(competitionData);
    });
  });

  describe('fetchPlayers', () => {
    it('should fetch players by competition', async () => {
      const playersData: PlayersResponseInterface[] = [
        {
          id: 3218,
          name: 'Lionel Messi',
          position: 'Offence',
          dateOfBirth: '1987-06-24',
          nationality: 'Argentina',
          team: 'Argentina',
        },
      ];

      jest
        .spyOn(playerService, 'getPlayersByCompetition')
        .mockImplementation(async () => playersData);

      expect(await controller.fetchPlayers('WC', { name: 'messi' })).toBe(
        playersData,
      );
    });
  });

  describe('fetchTeam by name', () => {
    it('should fetch team', async () => {
      const teamData = {
        id: 81,
        name: 'FC Barcelona',
        tla: 'FCB',
        shortName: 'Barça',
        areaName: 'Spain',
        address: 'Avenida Arístides Maillol s/n Barcelona 08028',
        competitions: ['CL'],
      };

      jest
        .spyOn(teamService, 'findTeamByName')
        .mockImplementation(async () => teamData);

      expect(
        await controller.fetchTeam('Barcelona', { includePlayers: 'false' }),
      ).toBe(teamData);
    });
  });
});
