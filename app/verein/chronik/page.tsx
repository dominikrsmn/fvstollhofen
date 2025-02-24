import content from "@/cms/content.json";
import { Timeline } from "@/components/timeline/Timeline";
import { Event } from "@/components/timeline/Event";

interface ChronikEvent {
  datum: string;
  inhalt: string;
  bild?: string;
}

export default function ChronikPage() {
  const chronikEvents = content.chronik as ChronikEvent[];

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8 my-24">
      <h1 className="text-4xl font-bold mb-12 text-center">Chronik</h1>
      <Timeline>
        {chronikEvents.map((event, index) => (
          <Event
            key={event.datum}
            date={event.datum}
            content={event.inhalt}
            image={event.bild}
            position={index % 2 === 0 ? "right" : "left"}
          />
        ))}
      </Timeline>
    </main>
  );
}
