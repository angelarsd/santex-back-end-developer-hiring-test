import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  name: String,
  position: String,
  dateOfBirth: String,
  nationality: String,
});

export interface PlayerDto {
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

export const PlayerModel = mongoose.model<PlayerDto & mongoose.Document>(
  'Player',
  PlayerSchema,
);
