export type Team =
  | "Herren 1"
  | "Herren 2"
  | "Junioren"
  | "Damen"
  | "Alte Herren";

export interface Game {
  date: string;
  competition: string;
  homeTeam: {
    name: string;
    score: number | null;
  };
  awayTeam: {
    name: string;
    score: number | null;
  };
  status?: string;
}
