import Hero from "@/components/Hero";
import NextGame from "@/components/NextGame";
import CompletedGames from "@/components/CompletedGames";
import SocialFeeds from "@/components/social/SocialFeeds";

export default function Home() {
  return (
    <main>
      <Hero />
      <NextGame />
      <CompletedGames />
      <SocialFeeds />
      {/* Other homepage sections will go here */}
    </main>
  );
}
