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
    logoUrl?: string;
  };
  awayTeam: {
    name: string;
    score: number | null;
    logoUrl?: string;
  };
  status?: string;
  updating?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    cached: boolean;
    fetchedAt: string;
    nextRefresh?: string;
  };
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
