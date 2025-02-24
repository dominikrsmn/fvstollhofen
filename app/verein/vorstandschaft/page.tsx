"use client";

import { Badge } from "@/components/ui/badge";
import content from "@/cms/content.json";
import { PersonCard } from "@/components/PersonCard";
import { useState } from "react";

type VorstandMember = {
  name: string;
  funktion: string;
  bild?: string;
};

function VorstandschaftPage() {
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  // Get unique functions for filtering
  const uniqueFunctions = Array.from(
    new Set(content.vorstand.map((member: VorstandMember) => member.funktion))
  );

  // Filter members based on selected function
  const filteredMembers = selectedFunction
    ? content.vorstand.filter(
        (member: VorstandMember) => member.funktion === selectedFunction
      )
    : content.vorstand;

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8 my-24">
      <div className="my-24">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Die Vorstandschaft des FV 1920 Stollhofen e.V.
        </h1>

        {/* Function Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={selectedFunction === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedFunction(null)}
          >
            Alle
          </Badge>
          {uniqueFunctions.map((funktion) => (
            <Badge
              key={funktion}
              variant={selectedFunction === funktion ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedFunction(funktion)}
            >
              {funktion}
            </Badge>
          ))}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member: VorstandMember) => (
            <PersonCard
              key={`${member.name}-${member.funktion}`}
              name={member.name}
              funktion={member.funktion}
              imageSrc={member.bild}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default VorstandschaftPage;
