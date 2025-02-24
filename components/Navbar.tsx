import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import content from "@/cms/content.json";
import { cn } from "@/lib/utils";
import { ExternalLink, Menu } from "lucide-react";

// Mock data for the live ticker - this should be replaced with real data later
const mockGameData = {
  status: "running", // "running" | "halbzeit" | "none"
  clubName: "SG Stollhofen / Söllingen",
  opposingClubName: "TuS Hügelsheim",
  homeGoals: 3,
  awayGoals: 2,
  minute: 22,
};

// Type definitions to match content.json structure
type NavigationLink = {
  titel: string;
  url: string;
};

type NavigationCategory = {
  titel: string;
  links: NavigationLink[];
};

type NavigationData = {
  kategorie: NavigationCategory[];
};

function isExternalLink(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function Navbar() {
  const navigationItems: NavigationData = content.navigation;
  const showLiveTicker = mockGameData.status !== "none";

  const NavigationItems = () => (
    <Accordion type="single" collapsible className="w-full">
      {navigationItems.kategorie.map((category) => (
        <AccordionItem key={category.titel} value={category.titel}>
          <AccordionTrigger className="text-base">
            {category.titel}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {category.links.map((link) => (
                <Link
                  key={link.titel}
                  href={link.url}
                  className="flex items-center justify-between text-sm hover:underline py-2"
                  {...(isExternalLink(link.url)
                    ? {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                >
                  {link.titel}
                  {isExternalLink(link.url) && (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <div className="w-full bg-primary">
      <nav className="flex justify-between items-center w-full max-w-[1200px] mx-auto py-4 px-4 text-primary-foreground">
        {/* Club Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo-white.png" alt="Club Logo" width={50} height={50} />
        </Link>

        <div className="flex items-center gap-8">
          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <NavigationMenu className="text-primary-foreground">
              <NavigationMenuList>
                {navigationItems.kategorie.map((category) => (
                  <NavigationMenuItem key={category.titel}>
                    <NavigationMenuTrigger className="text-primary-foreground bg-transparent hover:bg-primary-foreground/10 focus:bg-primary-foreground/10">
                      {category.titel}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 bg-popover">
                        {category.links.map((link) => (
                          <li key={link.titel}>
                            <NavigationMenuLink
                              asChild
                              className={cn(
                                "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-popover-foreground"
                              )}
                            >
                              <Link
                                href={link.url}
                                className="flex flex-row justify-between items-center gap-2"
                                {...(isExternalLink(link.url)
                                  ? {
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                    }
                                  : {})}
                              >
                                {link.titel}
                                {isExternalLink(link.url) && (
                                  <ExternalLink className="h-4 w-4" />
                                )}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger className="p-2">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] overflow-y-auto pt-10 px-6"
              >
                <nav className="flex flex-col gap-4">
                  <NavigationItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Live Ticker / Next Game */}
          {showLiveTicker && (
            <div className="fixed md:relative left-1/2 md:left-0 -translate-x-1/2 z-9 md:z-0 md:translate-x-0 bg-primary md:bg-card text-primary-foreground md:text-card-foreground px-5 py-3 rounded-md">
              <div className="relative">
                <div className="text-sm font-medium">
                  <span className="text-xs font-medium">
                    {mockGameData.clubName}
                  </span>
                  <span className="font-black">
                    {` ${mockGameData.homeGoals}:${mockGameData.awayGoals} `}
                  </span>
                  <span className="text-xs font-medium">
                    {mockGameData.opposingClubName}
                  </span>
                </div>
                <div className="absolute -bottom-6 -right-2 bg-secondary text-secondary-foreground font-bold px-2 py-1 text-xs rounded">
                  {mockGameData.status === "running"
                    ? `${mockGameData.minute}'`
                    : "Halbzeit"}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
