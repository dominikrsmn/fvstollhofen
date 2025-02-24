"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { MembershipModal } from "./MembershipModal";

const membershipTypes = [
  {
    id: "single",
    title: "Einzelmitgliedschaft",
    price: "50€",
    period: "jährlich",
  },
  {
    id: "family",
    title: "Familienmitgliedschaft",
    price: "90€",
    period: "jährlich",
  },
] as const;

function MembershipSelection() {
  const [selectedType, setSelectedType] = useState<"single" | "family" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContinue = () => {
    if (selectedType) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {membershipTypes.map((type) => (
          <Card
            key={type.id}
            className={`px-6 py-10 cursor-pointer transition-all ${
              selectedType === type.id
                ? "border-primary ring-1 ring-primary"
                : "hover:bg-muted"
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <div className="flex items-center gap-6">
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                {selectedType === type.id && (
                  <div className="w-4 h-4 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex justify-between items-center flex-1">
                <div>
                  <h3 className="font-bold text-xl">{type.title}</h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-black">{type.price}</div>
                  <div className="text-base text-muted-foreground ml-1">
                    {type.period}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="default"
          className="w-full bg-primary text-primary-foreground py-6 text-md cursor-pointer"
          disabled={!selectedType}
          onClick={handleContinue}
        >
          Weiter
        </Button>
      </div>

      {selectedType && (
        <MembershipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          membershipType={selectedType}
        />
      )}
    </>
  );
}

export { MembershipSelection };
