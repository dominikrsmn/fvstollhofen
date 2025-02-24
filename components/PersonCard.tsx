import Image from "next/image";
import { Card } from "@/components/ui/card";

interface PersonCardProps {
  name: string;
  funktion: string;
  imageSrc?: string;
}

export function PersonCard({ name, funktion, imageSrc }: PersonCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] relative bg-muted">
        {imageSrc ? (
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Kein Bild
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{funktion}</p>
      </div>
    </Card>
  );
}
