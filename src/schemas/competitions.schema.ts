import * as mongoose from 'mongoose';

export const CompetitionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  areaName: { type: String, required: true },
});

CompetitionSchema.index({ code: 1 }, { unique: true });

export interface CompetitionDocumentInterface {
  code: string;
  name: string;
  areaName: string;
}

export const CompetitionModel = mongoose.model<
  CompetitionDocumentInterface & mongoose.Document
>('Competition', CompetitionSchema);
