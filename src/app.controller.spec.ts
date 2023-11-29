import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getModelToken } from '@nestjs/mongoose';
import {
  ExternalApiService,
  ImportLeagueService,
  PlayerService,
  TeamService,
} from './services';

describe('AppController', () => {
  let controller: AppController;
  let importLeagueService: ImportLeagueService;

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
  });

  describe('createCompetition', () => {
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
});
