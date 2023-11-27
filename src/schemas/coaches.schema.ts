import * as mongoose from 'mongoose';

export const CoachSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: String,
  nationality: String,
});

export interface CoachDto {
  name: string;
  dateOfBirth: string;
  nationality: string;
}

export const CoachModel = mongoose.model<CoachDto & mongoose.Document>(
  'Coach',
  CoachSchema,
);