"use client";

import { Game } from "@/types/api";
import { formatDate, formatRelativeDate } from "@/utils/date";
import Image from "next/image";

interface GamesListProps {
  games: Game[];
}

export default function GamesList({ games }: GamesListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" role="status">
        Keine Spiele verfügbar
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list">
      {games.map((game, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${
            game.updating ? "opacity-50" : ""
          }`}
          role="listitem"
        >
          <div className="text-sm text-gray-600 mb-2">
            <time dateTime={game.date} title={formatDate(game.date)}>
              {formatRelativeDate(game.date)}
            </time>
            {" - "}
            <span>{game.competition}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-3">
              {game.homeTeam.logoUrl ? (
                <div className="w-8 h-8 relative flex-shrink-0">
                  <Image
                    src={game.homeTeam.logoUrl}
                    alt={`${game.homeTeam.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0" />
              )}
              <span className="font-medium">{game.homeTeam.name}</span>
            </div>
            <div
              className="px-4 font-bold"
              role="status"
              aria-label={`Spielstand: ${game.homeTeam.name} ${
                game.homeTeam.score ?? "-"
              } zu ${game.awayTeam.score ?? "-"} ${game.awayTeam.name}`}
            >
              {game.status ? (
                <span className="text-orange-600">{game.status}</span>
              ) : (
                <span>
                  {game.homeTeam.score !== null ? game.homeTeam.score : "-"}
                  {" : "}
                  {game.awayTeam.score !== null ? game.awayTeam.score : "-"}
                </span>
              )}
            </div>
            <div className="flex-1 flex items-center gap-3 justify-end">
              <span className="font-medium">{game.awayTeam.name}</span>
              {game.awayTeam.logoUrl ? (
                <div className="w-8 h-8 relative flex-shrink-0">
                  <Image
                    src={game.awayTeam.logoUrl}
                    alt={`${game.awayTeam.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
