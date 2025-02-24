"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const faqItems = [
  {
    question: "Wie werde ich Mitglied?",
    answer:
      "Du kannst zwischen einer Einzelmitgliedschaft oder einer Familienmitgliedschaft wählen (rechts findest du das Auswahlformular). Einfach das Formular ausfüllen und absenden – fertig!",
  },
  {
    question: "Wann wird der Mitgliedsbeitrag fällig?",
    answer:
      "Der Mitgliedsbeitrag wird jährlich per SEPA-Lastschrift eingezogen.",
  },
  {
    question: "Wie kann ich meine Mitgliedschaft kündigen?",
    answer:
      "Die Mitgliedschaft kann mit einer Frist von 3 Monaten zum Jahresende gekündigt werden.",
  },
];

function MembershipFAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <div key={index}>
          <button
            className="w-full py-2 flex justify-between items-center text-left"
            onClick={() => setOpenItem(openItem === index ? null : index)}
          >
            <span className="text-lg font-bold">{item.question}</span>
            <span className="text-2xl font-light">
              {openItem === index ? "−" : "+"}
            </span>
          </button>
          {openItem === index && (
            <div className="pb-4 text-muted-foreground text-base">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export { MembershipFAQ };
