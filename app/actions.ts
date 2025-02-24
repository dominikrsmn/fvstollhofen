"use server";

import { revalidateTag } from "next/cache";
import { monitoring } from "@/utils/monitoring";

export async function refreshGames() {
  try {
    // Invalidate all data tagged with 'games' in the cache
    await revalidateTag("games");
    monitoring.logPerformance("refreshGames", 0);
  } catch (error) {
    monitoring.logError(
      error instanceof Error ? error : new Error(String(error)),
      {
        action: "refreshGames",
      }
    );
    throw error;
  }
}
