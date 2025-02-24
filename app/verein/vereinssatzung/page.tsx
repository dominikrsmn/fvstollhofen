import { getContent } from "@/cms/content";

interface SatzungItem {
  punkt: string;
  inhalt: string;
}

function Vereinsatzung() {
  const content = getContent();
  const satzung: SatzungItem[] = content.vereinssatzung;

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8 my-24">
      <h1 className="text-4xl font-bold mb-12 text-center">Vereinssatzung</h1>

      <div className="space-y-12">
        {satzung.map((item: SatzungItem, index: number) => (
          <div key={index} className="flex gap-8 items-start">
            <div className="text-[4rem] font-bold text-primary/50 shrink-0 leading-none">
              {item.punkt}
            </div>
            <div
              className="prose prose-lg max-w-none pt-4"
              dangerouslySetInnerHTML={{ __html: item.inhalt }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

export default Vereinsatzung;
