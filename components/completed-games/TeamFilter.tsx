"use client";

import { cn } from "@/lib/utils";
import { Team } from "./types";

interface TeamFilterProps {
  teams: Team[];
  activeTeam: Team;
  onTeamChange: (team: Team) => void;
}

export default function TeamFilter({
  teams,
  activeTeam,
  onTeamChange,
}: TeamFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {teams.map((team) => (
        <button
          key={team}
          onClick={() => onTeamChange(team)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer",
            team === activeTeam
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {team}
        </button>
      ))}
    </div>
  );
}
