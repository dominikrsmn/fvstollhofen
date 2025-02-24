import Link from "next/link";
import { Facebook } from "lucide-react";

export default function FacebookFeed() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Facebook</h2>
        <Link
          href="https://www.facebook.com/fv1920stollhofen/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <span>Mehr</span>
          <Facebook className="h-5 w-5" />
        </Link>
      </div>

      {/* Facebook Feed Embed */}
      <div className="h-[600px] w-full bg-card rounded-lg"></div>
    </div>
  );
}
