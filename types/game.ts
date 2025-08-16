export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface GeneratedResult {
  teams: Team[];
  tossWinner?: string;
  mode: string;
}