import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

function NextGame() {
  // Mock data - replace with real data later
  const game = {
    date: "Sonntag 03.03",
    time: "15:30 Uhr",
    homeTeam: {
      name: "FV Stollhofen",
      logo: "/logo-color.jpg",
    },
    awayTeam: {
      name: "SV Weitenung",
      logo: "/weitenung.jpg",
    },
  };

  return (
    <div className={cn("max-w-4xl mx-auto px-4 my-8 sm:my-12")}>
      <div className="relative outline-primary outline-4 sm:outline-8 bg-popover px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 rounded-lg transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-card-foreground text-2xl sm:text-3xl font-bold text-center">
          Nächstes Spiel
        </h2>
        <div className="flex flex-col items-center justify-between my-6 sm:my-8 gap-6 sm:gap-8">
          <div className="flex items-center gap-8 sm:gap-12 md:gap-20">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 transition-transform duration-200 hover:scale-105">
              <div>
                <Image
                  src={game.homeTeam.logo}
                  alt={game.homeTeam.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-full"
                />
              </div>
              <span className="font-medium text-sm sm:text-base md:text-lg text-center">
                {game.homeTeam.name}
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col items-center text-primary transition-transform duration-200 hover:scale-110">
              <span className="text-sm sm:text-base font-black">
                {game.date.toUpperCase()}
              </span>
              <span className="text-xl sm:text-2xl font-bold">{game.time}</span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 transition-transform duration-200 hover:scale-105">
              <div>
                <Image
                  src={game.awayTeam.logo}
                  alt={game.awayTeam.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-full"
                />
              </div>
              <span className="font-medium text-sm sm:text-base md:text-lg text-center">
                {game.awayTeam.name}
              </span>
            </div>
          </div>
        </div>

        {/* More Games Link */}
        <div className="absolute bottom-2 right-3 sm:right-4">
          <div className="transition-transform duration-200 hover:translate-x-1">
            <Link
              href="/spiele"
              className="text-primary hover:text-primary/80 transition-colors text-sm sm:text-base"
            >
              weitere Spiele
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NextGame;
