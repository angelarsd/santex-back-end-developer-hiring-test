import * as mongoose from 'mongoose';

export const CoachSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
  nationality: { type: String, required: false },
  team: { type: Number, required: true },
});

CoachSchema.index({ id: 1 }, { unique: true });

export interface CoachDocumentInterface {
  id: number | null;
  name: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  team: number;
}

export const CoachModel = mongoose.model<
  CoachDocumentInterface & mongoose.Document
>('Coach', CoachSchema);
