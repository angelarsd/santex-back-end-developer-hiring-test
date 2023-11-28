import * as mongoose from 'mongoose';
import { LeagueCodeType } from 'src/types';

export const TeamSchema = new mongoose.Schema({
  name: String,
  tla: String,
  shortName: String,
  areaName: String,
  address: String,
  competitions: Array<LeagueCodeType>,
});

export interface TeamDto {
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
  competitions: LeagueCodeType[];
}

export const TeamModel = mongoose.model<TeamDto & mongoose.Document>(
  'Team',
  TeamSchema,
);
