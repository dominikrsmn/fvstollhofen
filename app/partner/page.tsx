import Link from "next/link";
import Image from "next/image";
import content from "@/cms/content.json";

interface Sponsor {
  name: string;
  logo?: string;
}

export default function PartnerPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 my-24">
      <div className="mb-12">
        <h1 className="mb-2 font-black text-primary">GÖNNER</h1>
        <h2 className="text-4xl font-bold mb-8">Unsere Partner</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/partner/partner-werden"
          className="relative bg-primary text-primary-foreground border border-primary rounded-md overflow-hidden hover:bg-primary/90 transition-colors"
        >
          <div className="aspect-[16/9] p-6 flex items-center justify-center">
            <span className="text-lg font-medium">Sponsor werden</span>
          </div>
        </Link>
        {(content.sponsoren as Sponsor[]).map((sponsor, index) => (
          <div
            key={sponsor.name}
            className="relative bg-white border border-border rounded-md overflow-hidden group"
          >
            <div className="h-1 bg-primary absolute top-0 left-0 right-0" />
            <div className="aspect-[16/9] p-6 flex items-center justify-center">
              {sponsor.logo ? (
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <span className="text-lg text-muted-foreground">
                  {sponsor.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
