import * as mongoose from 'mongoose';

export const CompetitionSchema = new mongoose.Schema({
  name: String,
  code: String,
  areaName: String,
});

export interface CompetitionDto {
  name: string;
  code: string;
  areaName: string;
}

export const CompetitionModel = mongoose.model<
  CompetitionDto & mongoose.Document
>('Competition', CompetitionSchema);
