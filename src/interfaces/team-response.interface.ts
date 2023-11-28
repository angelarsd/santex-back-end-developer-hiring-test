export interface TeamResponseInterface {
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
  competitions: string[];
  players?: PlayerResponseInterface[];
  coach?: CoachResponseInterface;
}

export interface PlayerResponseInterface {
  id: number;
  name: string;
  position: string;
  dateOfBirth: Date;
  nationality: string;
  team: string;
}

export interface CoachResponseInterface {
  name: string;
  dateOfBirth: string;
  nationality: string;
  team: string;
}
