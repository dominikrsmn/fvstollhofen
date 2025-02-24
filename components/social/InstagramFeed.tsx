import Link from "next/link";
import { Instagram } from "lucide-react";

export default function InstagramFeed() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Instagram</h2>
        <Link
          href="https://www.instagram.com/sg_stollhofensoellingen"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <span>Mehr</span>
          <Instagram className="h-5 w-5" />
        </Link>
      </div>

      {/* Instagram Feed Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mock Instagram posts - replace with real Instagram API integration */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg overflow-hidden"
          >
            {/* Replace with actual Instagram post embed or image */}
            <div className="w-full h-full bg-card animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
