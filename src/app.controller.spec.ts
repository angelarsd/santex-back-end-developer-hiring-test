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

      const importLeague = await controller.importLeague('CL');

      expect(importLeague).toBe(competitionData);
      expect(importLeagueService.fetchAndSaveData).toHaveBeenCalled();
      expect(importLeagueService.fetchAndSaveData).toHaveBeenCalledWith('CL');
    });
  });

  describe('fetchPlayers', () => {
    it('should fetch players by competition', async () => {
      const playersDataMock: PlayersResponseInterface[] = [
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
        .mockImplementation(async () => playersDataMock);

      const fetchPlayers = await controller.fetchPlayers('WC', {
        name: 'messi',
      });

      expect(fetchPlayers).toBe(playersDataMock);
      expect(playerService.getPlayersByCompetition).toHaveBeenCalled();
      expect(playerService.getPlayersByCompetition).toHaveBeenCalledWith('WC', {
        name: 'messi',
      });
    });
  });

  describe('fetchTeam', () => {
    it('should fetch team by name', async () => {
      const teamDataMock = {
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
        .mockImplementation(async () => teamDataMock);

      const includePlayers = await controller.fetchTeam('Barcelona', {
        includePlayers: 'false',
      });

      expect(includePlayers).toBe(teamDataMock);
      expect(teamService.findTeamByName).toHaveBeenCalled();
      expect(teamService.findTeamByName).toHaveBeenCalledWith(
        'Barcelona',
        false,
      );
    });
  });
});
