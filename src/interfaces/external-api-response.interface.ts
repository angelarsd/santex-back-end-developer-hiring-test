export interface TeamsAndPlayerExtApiResInterface {
  count: number;
  filters: FiltersExtApiResInterface;
  competition: CompetitionExtApiResInterface;
  season: SeasonExtApiResInterface;
  teams: TeamExtApiResInterface[];
}

export interface LeagueExtApiResInterface {
  area: AreaExtApiResInterface;
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  currentSeason: SeasonExtApiResInterface;
  seasons: SeasonExtApiResInterface[];
  lastUpdated: Date;
}

export interface CompetitionExtApiResInterface {
  id: number;
  name: string;
  code: string;
  type: 'CUP' | 'LEAGUE';
  emblem: null | string;
}

interface FiltersExtApiResInterface {
  season: string;
}

interface SeasonExtApiResInterface {
  id: number;
  startDate: Date;
  endDate: Date;
  currentMatchday: number;
  winner: null;
}

export interface TeamExtApiResInterface {
  area: AreaExtApiResInterface;
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: null | string;
  venue: string;
  runningCompetitions: CompetitionExtApiResInterface[];
  coach: CoachExtApiResInterface;
  squad: SquadExtApiResInterface[];
  staff: CoachExtApiResInterface[];
  lastUpdated: Date;
}

interface AreaExtApiResInterface {
  id: number;
  name: string;
  code: string;
  flag: null | string;
}

export interface CoachExtApiResInterface {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: Date;
  nationality: string;
  contract: ContractExtApiResInterface;
}

interface ContractExtApiResInterface {
  start: string;
  until: string;
}

export interface SquadExtApiResInterface {
  id: number;
  name: string;
  position: string;
  dateOfBirth: Date;
  nationality: string;
}
