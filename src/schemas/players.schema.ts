import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  nationality: { type: String, required: true },
  team: { type: Number, required: true },
});

PlayerSchema.index({ id: 1 }, { unique: true });

export interface PlayerDocumentInterface {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  team: number;
}

export const PlayerModel = mongoose.model<
  PlayerDocumentInterface & mongoose.Document
>('Player', PlayerSchema);
