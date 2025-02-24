import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SPONSORING_OPTIONS = [
  "Abteilungssponsoring",
  "Teamsponsoring",
  "Bandenwerbung",
  "Internetwerbung",
  "Lautsprecherwerbung",
  "Ballspenden",
  "Sonstiges",
  "Eventsponsoring",
] as const;

export default function PartnerWerdenPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 my-24">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="mb-2 font-black text-primary">GÖNNER</h1>
        <h2 className="text-4xl font-bold mb-8">Partner werden</h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
        {/* Left Column - Text Content */}
        <div className="lg:col-span-3 space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Unser Verein finanziert sich zu einem großen Teil durch faire und
            starke Partnerschaften mit Unternehmen aus der Region und darüber
            hinaus. Ihr Engagement als Sponsor oder Werbepartner hilft nicht nur
            uns - wir bieten Ihnen eine attraktive Plattform, um Ihr Unternehmen
            wirkungsvoll zu präsentieren und Ihre Reichweite zu vergrößern.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Als Partner des FV Stollhofen unterstützen Sie nicht nur den Verein,
            sondern werden Teil einer ehrgeizigen Vision: Durch gezielte
            Jugendarbeit und den Aufbau eigener Talente wollen wir sportlich
            wachsen und unseren Verein überregional etablieren - gemeinsam mit
            Ihnen!
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nutzen Sie die Chance, sich als Förderer eines traditionsreichen und
            zukunftsorientierten Vereins zu präsentieren. Es gibt viele
            Möglichkeiten, uns zu unterstützen.
          </p>
        </div>

        {/* Right Column - Image */}
        <div className="lg:col-span-2">
          <div className="aspect-[4/3] relative rounded-md overflow-hidden bg-muted">
            {/* Replace with actual image when available */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Vereinsbild
            </div>
          </div>
        </div>
      </div>

      {/* Sponsoring Options Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Sponsoring</h2>

        <RadioGroup
          defaultValue="Abteilungssponsoring"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {SPONSORING_OPTIONS.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-3 border border-border rounded-md p-4 hover:bg-accent cursor-pointer"
            >
              <RadioGroupItem value={option} id={option} />
              <Label
                htmlFor={option}
                className="flex-grow text-center cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-end">
          <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
}
