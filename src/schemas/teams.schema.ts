import * as mongoose from 'mongoose';

export const TeamSchema = new mongoose.Schema({
  name: String,
  tla: String,
  shortName: String,
  areaName: String,
  address: String,
});

export interface TeamDto {
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
}

export const TeamModel = mongoose.model<TeamDto & mongoose.Document>(
  'Team',
  TeamSchema,
);
