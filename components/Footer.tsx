import Image from "next/image";
import Link from "next/link";
import content from "@/cms/content.json";
import FootballIcon from "./icons/FootballIcon";

type FooterCategory = {
  titel: string;
  links: Array<{
    titel: string;
    url: string;
  }>;
};

type FooterData = {
  kategorie: FooterCategory[];
};

function Footer() {
  const footerData: FooterData = content.footer;

  return (
    <footer className="w-full bg-primary border-t border-primary-foreground/10">
      <div className="relative max-w-[1200px] mx-auto py-8 px-4">
        {/* Football Icon */}
        <div className="absolute -top-8 right-4 md:right-0">
          <FootballIcon />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Image
              src="/logo-white.png"
              alt="Club Logo"
              width={80}
              height={80}
            />
            <span className="text-primary-foreground font-medium">
              FV 1920 Stollhofen e.V.
            </span>
            <div className="flex gap-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Image
                  src="/assets/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Image
                  src="/assets/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          {/* Right Section - Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
            {footerData.kategorie.map((category) => (
              <div key={category.titel} className="space-y-2">
                <h3 className="text-primary-foreground font-medium mb-2">
                  {category.titel}
                </h3>
                <div className="flex flex-col gap-2">
                  {category.links.map((link) => (
                    <Link
                      key={link.titel}
                      href={link.url}
                      className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link.titel}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
