import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getModelToken('Player'),
          useValue: { aggregate: jest.fn() },
        },
      ],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
  });

  describe('getPlayersByCompetition', () => {
    it('should return an player', async () => {
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
        .spyOn(teamService['playerModel'], 'aggregate')
        .mockResolvedValue(playersData);
      const result = await teamService.findTeamByName('CL', {
        name: 'messi',
      });
      expect(result).toEqual(playersData);
    });
  });
});
