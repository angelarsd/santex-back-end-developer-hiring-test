import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PlayerService } from './player.service';
import { HttpException } from '@nestjs/common';

describe('PlayerService', () => {
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getModelToken('Player'),
          useValue: { aggregate: jest.fn() },
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
  });

  describe('getPlayersByCompetition', () => {
    it('Should return a players list', async () => {
      const playersData = [
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
        .spyOn(playerService['playerModel'], 'aggregate')
        .mockResolvedValue(playersData);
      const result = await playerService.getPlayersByCompetition('WC', {
        name: 'messi',
      });
      expect(result).toEqual(playersData);
    });

    it('Should return an error', async () => {
      const playersData = [];
      jest
        .spyOn(playerService['playerModel'], 'aggregate')
        .mockResolvedValue(playersData);

      const getPlayersByCompetition = async () =>
        await playerService.getPlayersByCompetition('WC', {
          name: 'goatmessi',
        });

      await expect(getPlayersByCompetition).rejects.toThrow(HttpException);
    });
  });
});
