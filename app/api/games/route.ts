import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { deobfuscateScore } from "./font-utils";
import { limiter, speedLimiter } from "@/utils/rate-limit";
import { monitoring } from "@/utils/monitoring";
import { ApiResponse, ApiError, Game, Team } from "@/types/api";

export const revalidate = 3600; // revalidate every hour

const TEAM_URLS: Partial<Record<Team, string>> = {
  "Herren 1": "011MIEFR5O000000VTVG0001VTR8C1K7",
  "Herren 2": "011MI9OEBK000000VTVG0001VTR8C1K7",
  Damen: "011MIDHH3C000000VTVG0001VTR8C1K7",
};

async function fetchGamesForTeam(teamId: string): Promise<Game[]> {
  const response = await fetch(
    `https://www.fussball.de/ajax.team.prev.games/-/mode/PAGE/team-id/${teamId}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      next: {
        tags: ["games"],
        revalidate: 3600,
      },
    }
  );

  const html = await response.text();
  const $ = cheerio.load(html);

  const gameRows = $("tr:not(.row-headline):not(.row-competition)")
    .toArray()
    .filter((element) => $(element).find(".column-club").length > 0);

  return Promise.all(
    gameRows.map(async (element) => {
      const $row = $(element);

      const competition = $row
        .prevAll(".row-competition")
        .first()
        .find(".column-team a")
        .text()
        .trim();
      const date = $row
        .prevAll(".row-competition")
        .first()
        .find(".column-date")
        .text()
        .trim();

      // Extract team data
      const $homeTeam = $row.find(".column-club").first();
      const $awayTeam = $row.find(".column-club").last();

      const homeTeamName = $homeTeam.find(".club-name").text().trim();
      const homeTeamLogoUrl = $homeTeam
        .find(".club-logo span")
        .attr("data-responsive-image");

      const awayTeamName = $awayTeam.find(".club-name").text().trim();
      const awayTeamLogoUrl = $awayTeam
        .find(".club-logo span")
        .attr("data-responsive-image");

      let homeScore: number | null = null;
      let awayScore: number | null = null;
      let gameStatus = $row.find(".column-score .info-text").text().trim();

      if (!gameStatus) {
        const $scoreElement = $row.find(".column-score a");
        const obfuscationId = $scoreElement
          .find("[data-obfuscation]")
          .attr("data-obfuscation");

        if (obfuscationId) {
          const scoreLeft = $scoreElement.find(".score-left").text();
          const scoreRight = $scoreElement
            .find(".score-right")
            .text()
            .replace(/<span.*?<\/span>/, "");

          // Deobfuscate scores
          [homeScore, awayScore] = await Promise.all([
            deobfuscateScore(obfuscationId, scoreLeft),
            deobfuscateScore(obfuscationId, scoreRight),
          ]);
        }
      }

      return {
        date,
        competition,
        homeTeam: {
          name: homeTeamName,
          score: homeScore,
          logoUrl: homeTeamLogoUrl ? `https:${homeTeamLogoUrl}` : undefined,
        },
        awayTeam: {
          name: awayTeamName,
          score: awayScore,
          logoUrl: awayTeamLogoUrl ? `https:${awayTeamLogoUrl}` : undefined,
        },
        ...(gameStatus && { status: gameStatus }),
      };
    })
  );
}

export async function GET(
  request: Request
): Promise<NextResponse<ApiResponse<Game[]>>> {
  const startTime = Date.now();

  try {
    // Apply rate limiting
    await limiter.check();
    await speedLimiter.check();

    // Get team from query parameter
    const { searchParams } = new URL(request.url);
    const team = (searchParams.get("team") as Team) || "Herren 1";

    const teamId = TEAM_URLS[team];
    if (!teamId) {
      throw new Error(`Invalid team: ${team}`);
    }

    const games = await fetchGamesForTeam(teamId);

    const duration = Date.now() - startTime;
    monitoring.logApiCall("/api/games", true, duration);

    return NextResponse.json({
      data: games,
      meta: {
        cached: true,
        fetchedAt: new Date().toISOString(),
        nextRefresh: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    monitoring.logError(error as Error, { endpoint: "/api/games" });
    monitoring.logApiCall("/api/games", false, duration);

    const apiError: ApiError = {
      code: "FETCH_ERROR",
      message: "Failed to fetch games",
      details: error instanceof Error ? error.message : String(error),
    };

    return NextResponse.json(
      {
        data: [],
        meta: {
          cached: false,
          fetchedAt: new Date().toISOString(),
        },
        error: apiError,
      },
      { status: 500 }
    );
  }
}
