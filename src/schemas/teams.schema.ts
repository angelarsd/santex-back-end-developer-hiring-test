import * as mongoose from 'mongoose';
import { LeagueCodeType } from '../types';

export const TeamSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  tla: { type: String, required: false },
  shortName: { type: String, required: true },
  areaName: { type: String, required: true },
  address: { type: String, required: true },
  competitions: { type: Array<LeagueCodeType>, required: true },
});

TeamSchema.index({ id: 1 }, { unique: true });

export interface TeamDocumentInterface {
  id: number;
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
  competitions: LeagueCodeType[];
}

export const TeamModel = mongoose.model<
  TeamDocumentInterface & mongoose.Document
>('Team', TeamSchema);
