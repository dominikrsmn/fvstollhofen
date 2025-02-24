import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/date-range-picker";
import { Utensils, Music, Tv, Wifi, Target, Armchair } from "lucide-react";
import { ImageCarousel } from "@/components/image-carousel";
import Image from "next/image";

const images = [
  {
    src: "/clubhaus-hero.jpg",
    alt: "Clubhaus Außenansicht",
  },
  {
    src: "/clubhaus-interior.jpg",
    alt: "Clubhaus Innenansicht",
  },
  {
    src: "/clubhaus-event.jpg",
    alt: "Clubhaus Event",
  },
];

export default function ClubhausPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8 my-24">
      {/* Hero Section */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {/* Left Side - Image */}
        <Card className="bg-card text-card-foreground border border-border rounded-lg p-4 w-full h-[400px] overflow-hidden">
          <div className="w-full h-full relative">
            <Image
              src="/clubhaus-hero.jpg"
              alt="Clubhaus Außenansicht"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </Card>

        {/* Right Side - Content */}
        <div className="flex flex-col h-3/4 justify-center">
          <h2 className="text-4xl font-bold text-foreground">
            Deine Eventlocation
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            Im Herzen Rheinmünsters
          </p>
        </div>

        {/* Booking Form */}
        <Card className="md:absolute bottom-[-40px] left-1/2 transform md:-translate-x-1/2 w-full md:w-3/4 bg-card rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Zweck" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="wedding">Hochzeit</SelectItem>
                <SelectItem value="other">Sonstiges</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-2">
              <DateRangePicker />
            </div>
            <Input
              type="number"
              placeholder="Anzahl Gäste"
              min={1}
              className="bg-card"
            />
            <Button className="md:col-span-4 bg-primary text-primary-foreground">
              Angebot
            </Button>
          </div>
        </Card>
      </div>

      {/* Amenities Overview */}

      {/* Equipment Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 my-32">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-lg border border-border bg-card flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm text-foreground">2 Darts</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-lg border border-border bg-card flex items-center justify-center">
            <Armchair className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm text-foreground">20 Tische</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-lg border border-border bg-card flex items-center justify-center">
            <Armchair className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm text-foreground">30 Stühle</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-lg border border-border bg-card flex items-center justify-center">
            <Armchair className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm text-foreground">20 Tische</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-lg border border-border bg-card flex items-center justify-center">
            <Armchair className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm text-foreground">30 Stühle</span>
        </div>
      </div>

      {/* Second Image */}
      <Card className="bg-card text-card-foreground border border-border rounded-lg p-4 w-full h-[500px] overflow-hidden">
        <ImageCarousel images={images} className="w-full h-full" />
      </Card>
    </main>
  );
}
