export interface GenerateTeamsRequest {
  game: string;
  mode: string;
  players: string[];
  numTeams: number;
  teamSize: number;
  numMatches: number;
  needsToss?: boolean;
}

export interface Team {
  name: string;
  players: string[];
  doubleSidedPlayers?: string[];
}

export interface Match {
  match: number;
  team1: string;
  team2: string;
  toss?: string;
  time: string;
}

export interface GenerateTeamsResponse {
  teams: Team[];
  matches: Match[];
  gameRules: string[];
  success: boolean;
  error?: string;
}

export interface ShareData {
  teams: Team[];
  matches: Match[];
  game: string;
  mode: string;
}

export interface ValidateGameRequest {
  gameName: string;
}

export interface ValidateGameResponse {
  isValid: boolean;
  validationMessage?: string;
  needsToss: boolean;
  rules: string[];
}