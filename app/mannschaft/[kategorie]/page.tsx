import Image from "next/image";
import content from "@/cms/content.json";
import { notFound } from "next/navigation";

interface TeamData {
  name: string;
  liga?: string;
  zusatz?: string;
  gruppenbild?: string;
}

interface TeamMember {
  name: string;
  funktion: string;
  bild?: string;
}

interface Location {
  name: string;
  bild?: string;
}

interface TeamTypes {
  kategorie: string;
  mannschaft: TeamData[];
  verantwortlich: TeamMember[];
  ort: Location[];
  termine: {
    tage: string;
    uhrzeit: string;
  };
  bemerkung?: string;
}

async function MannschaftPage({
  params,
}: {
  params: Promise<{ kategorie: string }>;
}) {
  // Get the team data
  const kategorie = (await params).kategorie;

  const teamData = content.mannschaftstypen.find(
    (typ) => typ.kategorie === kategorie
  ) as TeamTypes;

  if (!teamData) {
    notFound();
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8 my-24">
      {/* Team Images Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {teamData.mannschaft.map((team: TeamData) => (
          <div key={team.name} className="space-y-2 w-full h-full">
            <h2 className="text-2xl font-bold">{team.name}</h2>
            <div className="relative aspect-video bg-muted rounded-lg ">
              {team.gruppenbild ? (
                <Image
                  src={team.gruppenbild}
                  alt={team.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Kein Gruppenbild
                </div>
              )}
              {(team.liga || team.zusatz) && (
                <div className="absolute -bottom-4 -right-4 bg-popover rounded-lg px-8 py-4 shadow-md">
                  <p className="text-sm font-black leading-tight text-primary">
                    {team.liga?.toUpperCase()}
                  </p>
                  {team.zusatz && (
                    <p className="text-xs text-muted-foreground leading-tight">
                      {team.zusatz}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
        {/* Left Section: Team Staff */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-3 gap-6">
            {teamData.verantwortlich.map((person: TeamMember) => (
              <div
                key={`${person.name}-${person.funktion}`}
                className="space-y-2"
              >
                <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden">
                  {person.bild ? (
                    <Image
                      src={person.bild}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Kein Bild
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {person.funktion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Information */}
        <div className="lg:col-span-3 space-y-6">
          {/* Location Card */}
          <div>
            <div className="flex rounded-2xl border h-[150px] overflow-hidden">
              {teamData.ort.map((location: Location) => (
                <div
                  key={location.name}
                  className="relative text-center w-full"
                >
                  {location.bild ? (
                    <Image
                      src={location.bild}
                      alt={location.name}
                      fill
                      className=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Kein Bild
                    </div>
                  )}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="absolute bottom-1 font-black text-sm text-center px-2 py-1 bg-primary-foreground text-primary rounded-md">
                      {location.name.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="font-medium mb-4 mt-2">Spiel- & Trainingsort</h3>
          </div>

          {/* Training Times Card */}
          <div>
            <div className="flex flex-col justify-center rounded-2xl border p-4 h-[150px] text-center">
              <p className="font-bold text-lg">{teamData.termine.tage}</p>
              <p className="text-xl text-muted-foreground font-black">
                {teamData.termine.uhrzeit}
              </p>
            </div>
            <h3 className="font-medium mb-4 mt-2">Trainingstermine</h3>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MannschaftPage;
