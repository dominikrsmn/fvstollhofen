import Link from "next/link";

export default function Custom404() {
  return (
    <div className="w-full h-[45vh] md:h-[63vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-black">404</h1>
      <p className="text-muted-foreground">
        Die Seite, die Sie suchen, existiert nicht.
      </p>
      <Link href="/" className="text-primary">
        Zur Startseite
      </Link>
    </div>
  );
}
