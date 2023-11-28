export const TLeagueCodeType = {
  WC: 'WC', // FIFA World Cup
  CL: 'CL', // UEFA Champions League
  BL1: 'BL1', // Bundesliga
  DED: 'DED', // Eredivisie
  BSA: 'BSA', // Campeonato Brasileiro Série A
  PD: 'PD', // Primera Division
  FL1: 'FL1', // Ligue 1
  ELC: 'ELC', // Championship
  PPL: 'PPL', // Primeira Liga
  EC: 'EC', // European Championship
  SA: 'SA', // Serie A
  PL: 'PL', // Premier League
  CLI: 'CLI', // Copa Libertadores
} as const;

export type LeagueCodeType =
  (typeof TLeagueCodeType)[keyof typeof TLeagueCodeType];
