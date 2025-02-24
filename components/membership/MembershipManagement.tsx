"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function MembershipManagement() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {(() => {
          const today = new Date();
          const nextApril = new Date(
            today.getFullYear() + (today.getMonth() >= 3 ? 1 : 0),
            3,
            1
          );
          const diffTime = Math.abs(nextApril.getTime() - today.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const months = Math.floor(diffDays / 30);
          const days = diffDays % 30;

          if (diffDays === 365) {
            return "Beitragszahlung heute fällig";
          }

          let paymentText = "Beitragszahlung fällig in ";
          if (months > 0) {
            paymentText += `${months} Monaten`;
            if (days > 0) {
              paymentText += ` und ${days} Tagen`;
            }
          } else {
            paymentText += `${days} Tagen`;
          }
          return paymentText;
        })()}
      </div>

      <Card className="border border-destructive p-4 flex flex-row justify-between items-center max-w-xl">
        <div>
          <h3 className="font-medium">Mitgliedschaft kündigen</h3>
        </div>
        <Button
          variant="outline"
          className="border-destructive text-destructive cursor-pointer"
        >
          Jetzt kündigen
        </Button>
      </Card>
    </div>
  );
}

export { MembershipManagement };
