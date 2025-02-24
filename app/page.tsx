import Hero from "@/components/Hero";
import NextGame from "@/components/NextGame";
import CompletedGames from "@/components/CompletedGames";
import SocialFeeds from "@/components/social/SocialFeeds";

// Mock data for NextGame
const nextGameData = {
  date: "Sonntag 03.03",
  time: "15:30 Uhr",
  homeTeam: {
    name: "FV Stollhofen",
    logo: "/logo.png",
  },
  awayTeam: {
    name: "SV Weitenung",
    logo: "/opponent-logo.png",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <NextGame {...nextGameData} />
      <CompletedGames />
      <SocialFeeds />
      {/* Other homepage sections will go here */}
    </main>
  );
}
