"use client";

import { useState, useEffect, useCallback } from "react";
import TeamFilter from "@/components/completed-games/TeamFilter";
import GamesList from "@/components/completed-games/GamesList";
import { Team, Game, ApiResponse } from "@/types/api";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GamesSkeleton } from "@/components/GamesSkeleton";
import { monitoring } from "@/utils/monitoring";

// Teams data - could be moved to a configuration file later
const teams: Team[] = [
  "Herren 1",
  "Herren 2",
  "Junioren",
  "Damen",
  "Alte Herren",
];

const SUPPORTED_TEAMS = ["Herren 1", "Herren 2", "Damen"] as const;
type SupportedTeam = (typeof SUPPORTED_TEAMS)[number];

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CompletedGames() {
  const [activeTeam, setActiveTeam] = useState<Team>("Herren 1");
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    const startTime = Date.now();

    if (!SUPPORTED_TEAMS.includes(activeTeam as SupportedTeam)) {
      setGames([]); // Clear games for unsupported teams
      setError("Noch keine Spiele verfügbar für dieses Team");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/games?team=${encodeURIComponent(activeTeam)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = (await response.json()) as ApiResponse<Game[]>;
      setGames(data.data);
      setLastUpdated(data.meta.fetchedAt);
      monitoring.logPerformance("fetchGames", Date.now() - startTime);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError("Failed to load games. Please try again later.");
      monitoring.logError(error, {
        component: "CompletedGames",
        operation: "fetchGames",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTeam]);

  useEffect(() => {
    fetchGames();
  }, [activeTeam, fetchGames]);

  return (
    <ErrorBoundary>
      <div className="max-w-[1200px] mx-auto px-4 my-12">
        <div className="flex justify-between items-center mb-6">
          <TeamFilter
            teams={teams}
            activeTeam={activeTeam}
            onTeamChange={setActiveTeam}
          />
          {lastUpdated && (
            <div
              className="text-sm text-gray-500"
              title={new Date(lastUpdated).toLocaleString("de-DE")}
            >
              Stand: {formatTime(lastUpdated)}
            </div>
          )}
        </div>

        {isLoading ? (
          <GamesSkeleton />
        ) : error ? (
          <div className="text-red-600 text-center py-4" role="alert">
            {error}
          </div>
        ) : (
          <GamesList games={games} />
        )}
      </div>
    </ErrorBoundary>
  );
}
