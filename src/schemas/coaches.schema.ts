import * as mongoose from 'mongoose';

export const CoachSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  nationality: { type: String, required: true },
  team: { type: Number, required: true },
});

CoachSchema.index({ id: 1 }, { unique: true });

export interface CoachDocumentInterface {
  id: number;
  name: string;
  dateOfBirth: string;
  nationality: string;
  team: number;
}

export const CoachModel = mongoose.model<
  CoachDocumentInterface & mongoose.Document
>('Coach', CoachSchema);
