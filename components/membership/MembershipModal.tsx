"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle, Check } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "motion/react";
import confetti from "canvas-confetti";

type Step = "personal" | "contact" | "family" | "sepa" | "confirm";

type ContactMethod = {
  id: string;
  type: "email" | "landline" | "mobile";
  value: string;
  isPrimary?: boolean;
};

type FamilyMember = {
  id: string;
  firstName: string;
  lastName: string;
  role: "spouse" | "parent" | "children" | "sibling";
  isUnderage?: boolean;
};

type SepaData = {
  accountHolder: string;
  iban: string;
  bic: string;
};

type PersonalData = {
  firstName: string;
  lastName: string;
  birthDate: Date | undefined;
  address: string;
  plz: string;
  city: string;
};

type ValidationErrors = {
  [key: string]: string;
};

// Add this type for the confirmation checkboxes
type ConfirmationState = {
  contactData: boolean;
  sepaMandate: boolean;
  privacy: boolean;
  dataProtection: boolean;
  emailConsent: boolean;
};

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipType: "single" | "family";
}

function MembershipModal({
  isOpen,
  onClose,
  membershipType,
}: MembershipModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [month, setMonth] = useState<Date>(new Date());
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [sepaData, setSepaData] = useState<SepaData>({
    accountHolder: "",
    iban: "",
    bic: "",
  });
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: "",
    lastName: "",
    birthDate: undefined,
    address: "",
    plz: "",
    city: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [dateInput, setDateInput] = useState<string>("");
  // Add state for confirmation checkboxes
  const [confirmations, setConfirmations] = useState<ConfirmationState>({
    contactData: false,
    sepaMandate: false,
    privacy: false,
    dataProtection: false,
    emailConsent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate array of years from 1920 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1919 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  const handleYearSelect = (year: string) => {
    // Create new date with same month but new year
    const newMonth = new Date(month);
    newMonth.setFullYear(parseInt(year));
    setMonth(newMonth);

    // Update birthDate if exists
    if (personalData.birthDate) {
      const newDate = new Date(personalData.birthDate);
      newDate.setFullYear(parseInt(year));
      handlePersonalChange("birthDate", newDate);
    }
  };

  const handleAddContact = (type: ContactMethod["type"]) => {
    // Check if type is already added (for email and landline)
    if (
      (type === "email" || type === "landline") &&
      contactMethods.some((method) => method.type === type)
    ) {
      return;
    }

    const newMethod: ContactMethod = {
      id: crypto.randomUUID(),
      type,
      value: "",
      isPrimary:
        type === "mobile"
          ? !contactMethods.some((m) => m.type === "mobile")
          : undefined,
    };
    setContactMethods([...contactMethods, newMethod]);
  };

  const handleContactChange = (id: string, value: string) => {
    setContactMethods((methods) =>
      methods.map((method) =>
        method.id === id ? { ...method, value } : method
      )
    );
  };

  const handlePrimaryChange = (id: string) => {
    setContactMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isPrimary: method.id === id,
      }))
    );
  };

  const handleRemoveContact = (id: string) => {
    setContactMethods((methods) => {
      const filtered = methods.filter((method) => method.id !== id);
      // If we removed the primary mobile, make the first remaining mobile primary
      if (methods.find((m) => m.id === id)?.isPrimary) {
        const firstMobile = filtered.find((m) => m.type === "mobile");
        if (firstMobile) {
          return filtered.map((m) => ({
            ...m,
            isPrimary: m.id === firstMobile.id,
          }));
        }
      }
      return filtered;
    });
  };

  const handleAddFamilyMember = () => {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      firstName: "",
      lastName: "",
      role: "spouse",
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const handleFamilyMemberChange = (
    id: string,
    field: keyof FamilyMember,
    value: string | boolean
  ) => {
    setFamilyMembers((members) =>
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers((members) => members.filter((member) => member.id !== id));
  };

  const handleSepaChange = (field: keyof SepaData, value: string) => {
    if (field === "iban") {
      // Just format IBAN with spaces
      const cleanValue = value.replace(/\s/g, "").toUpperCase();
      const formattedValue = cleanValue.replace(/(.{4})/g, "$1 ").trim();
      setSepaData((prev) => ({
        ...prev,
        iban: formattedValue,
      }));
    } else {
      setSepaData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handlePersonalChange = (
    field: keyof PersonalData,
    value: string | Date | undefined
  ) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const isDateInFuture = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const parseDateString = (dateStr: string): Date | undefined => {
    // Allow any input but only parse if it matches the format
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) return undefined;

    const [day, month, year] = dateStr.split(".").map(Number);
    const date = new Date(year, month - 1, day);

    // Validate that the date is real and not in the future
    if (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year &&
      !isDateInFuture(date)
    ) {
      return date;
    }

    return undefined;
  };

  const validatePersonalData = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!personalData.firstName.trim()) {
      newErrors.firstName = "Vorname ist erforderlich";
    }
    if (!personalData.lastName.trim()) {
      newErrors.lastName = "Nachname ist erforderlich";
    }
    if (!personalData.birthDate) {
      newErrors.birthDate = "Geburtsdatum ist erforderlich";
    } else if (isDateInFuture(personalData.birthDate)) {
      newErrors.birthDate = "Geburtsdatum darf nicht in der Zukunft liegen";
    }
    if (!personalData.address.trim()) {
      newErrors.address = "Adresse ist erforderlich";
    }
    if (!personalData.plz.trim()) {
      newErrors.plz = "PLZ ist erforderlich";
    } else if (!/^\d{5}$/.test(personalData.plz)) {
      newErrors.plz = "PLZ muss 5 Ziffern enthalten";
    }
    if (!personalData.city.trim()) {
      newErrors.city = "Ort ist erforderlich";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactData = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!contactMethods.some((m) => m.type === "email")) {
      newErrors.contacts = "Eine E-Mail-Adresse ist erforderlich";
    }

    contactMethods.forEach((method) => {
      if (!method.value.trim()) {
        newErrors[`contact-${method.id}`] = "Kontaktdaten sind erforderlich";
      } else if (
        method.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(method.value)
      ) {
        newErrors[`contact-${method.id}`] = "Ungültige E-Mail-Adresse";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFamilyData = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (familyMembers.length === 0) {
      newErrors.family = "Mindestens ein Familienmitglied ist erforderlich";
    }

    familyMembers.forEach((member) => {
      if (!member.firstName.trim()) {
        newErrors[`family-${member.id}-firstName`] = "Vorname ist erforderlich";
      }
      if (!member.lastName.trim()) {
        newErrors[`family-${member.id}-lastName`] = "Nachname ist erforderlich";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSepaData = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!sepaData.accountHolder.trim()) {
      newErrors.accountHolder = "Kontoinhaber ist erforderlich";
    }
    if (!sepaData.iban.trim()) {
      newErrors.iban = "IBAN ist erforderlich";
    } else if (
      !/^DE\d{2}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{2}$/.test(
        sepaData.iban.replace(/\s/g, "")
      )
    ) {
      newErrors.iban = "Ungültige IBAN";
    }
    if (!sepaData.bic.trim()) {
      newErrors.bic = "BIC ist erforderlich";
    } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(sepaData.bic)) {
      newErrors.bic = "Ungültige BIC";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add handler for confirmation changes
  const handleConfirmationChange = (key: keyof ConfirmationState) => {
    setConfirmations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Add validation for confirm step
  const validateConfirmData = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!confirmations.contactData) {
      newErrors.contactData =
        "Bitte bestätigen Sie die Richtigkeit Ihrer Daten";
    }
    if (!confirmations.sepaMandate) {
      newErrors.sepaMandate =
        "Bitte akzeptieren Sie das SEPA-Lastschriftmandat";
    }
    if (!confirmations.privacy) {
      newErrors.privacy = "Bitte akzeptieren Sie die Datenschutzerklärung";
    }
    if (!confirmations.dataProtection) {
      newErrors.dataProtection = "Bitte bestätigen Sie die Informationspflicht";
    }
    if (!confirmations.emailConsent) {
      newErrors.emailConsent = "Bitte bestätigen Sie die E-Mail-Einwilligung";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add confetti function
  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const steps = {
    personal: {
      title: "Persönliche Daten",
      component: (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input
                id="firstName"
                value={personalData.firstName}
                onChange={(e) =>
                  handlePersonalChange("firstName", e.target.value)
                }
                placeholder="Max"
                className={cn(
                  "cursor-text",
                  errors.firstName && "border-destructive"
                )}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input
                id="lastName"
                value={personalData.lastName}
                onChange={(e) =>
                  handlePersonalChange("lastName", e.target.value)
                }
                placeholder="Mustermann"
                className={cn(
                  "cursor-text",
                  errors.lastName && "border-destructive"
                )}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Geburtsdatum</Label>
            <div className="relative">
              <Input
                id="birthDate"
                value={dateInput}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow digits and dots
                  const cleaned = value.replace(/[^\d.]/g, "");

                  // Format with automatic dots
                  let formatted = cleaned;
                  if (
                    cleaned.length === 2 &&
                    !cleaned.includes(".") &&
                    value.length > dateInput.length
                  ) {
                    formatted = cleaned + ".";
                  } else if (
                    cleaned.length === 5 &&
                    cleaned.split(".").length === 2 &&
                    value.length > dateInput.length
                  ) {
                    formatted = cleaned + ".";
                  }

                  // Prevent more than 10 characters (DD.MM.YYYY)
                  formatted = formatted.slice(0, 10);

                  setDateInput(formatted);

                  // Try to parse the date if it matches the format
                  const date = parseDateString(formatted);
                  if (date) {
                    handlePersonalChange("birthDate", date);
                    setMonth(date);
                  } else {
                    handlePersonalChange("birthDate", undefined);
                  }
                }}
                placeholder="TT.MM.JJJJ"
                className={cn(
                  "cursor-text pr-10",
                  errors.birthDate && "border-destructive"
                )}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                      errors.birthDate && "text-destructive"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="border-b border-border p-3">
                    <Select
                      value={month.getFullYear().toString()}
                      onValueChange={handleYearSelect}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Jahr" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Calendar
                    mode="single"
                    selected={personalData.birthDate}
                    onSelect={(date) => {
                      if (date && !isDateInFuture(date)) {
                        handlePersonalChange("birthDate", date);
                        setMonth(date);
                        setDateInput(
                          format(date, "dd.MM.yyyy", { locale: de })
                        );
                      }
                    }}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={(date) => isDateInFuture(date)}
                    initialFocus
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {errors.birthDate && (
              <p className="text-sm text-destructive">{errors.birthDate}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={personalData.address}
              onChange={(e) => handlePersonalChange("address", e.target.value)}
              placeholder="Musterstraße 1"
              className={cn(
                "cursor-text",
                errors.address && "border-destructive"
              )}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plz">PLZ</Label>
              <Input
                id="plz"
                value={personalData.plz}
                onChange={(e) => handlePersonalChange("plz", e.target.value)}
                placeholder="12345"
                className={cn(
                  "cursor-text",
                  errors.plz && "border-destructive"
                )}
              />
              {errors.plz && (
                <p className="text-sm text-destructive">{errors.plz}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ort</Label>
              <Input
                id="city"
                value={personalData.city}
                onChange={(e) => handlePersonalChange("city", e.target.value)}
                placeholder="Musterstadt"
                className={cn(
                  "cursor-text",
                  errors.city && "border-destructive"
                )}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    contact: {
      title: "Kontaktdaten",
      component: (
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label>Kontaktmöglichkeiten</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Hinzufügen
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleAddContact("email")}
                  disabled={contactMethods.some((m) => m.type === "email")}
                >
                  E-Mail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAddContact("landline")}
                  disabled={contactMethods.some((m) => m.type === "landline")}
                >
                  Festnetz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddContact("mobile")}>
                  Mobiltelefon
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-4">
            {contactMethods.map((method) => (
              <div key={method.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {method.type === "email" && "E-Mail"}
                    {method.type === "landline" && "Festnetz"}
                    {method.type === "mobile" && "Mobiltelefon"}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContact(method.id)}
                  >
                    Entfernen
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Input
                    value={method.value}
                    onChange={(e) =>
                      handleContactChange(method.id, e.target.value)
                    }
                    placeholder={
                      method.type === "email"
                        ? "max@mustermann.de"
                        : method.type === "landline"
                        ? "07227 1234"
                        : "+49 123 45678900"
                    }
                    type={method.type === "email" ? "email" : "tel"}
                    className={cn(
                      "cursor-text",
                      errors[`contact-${method.id}`] && "border-destructive"
                    )}
                  />
                  {method.type === "mobile" && (
                    <RadioGroup
                      value={method.isPrimary ? method.id : undefined}
                      onValueChange={handlePrimaryChange}
                      className="flex"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={method.id}
                          id={`primary-${method.id}`}
                        />
                        <Label htmlFor={`primary-${method.id}`}>Primär</Label>
                      </div>
                    </RadioGroup>
                  )}
                </div>
                {errors[`contact-${method.id}`] && (
                  <p className="text-sm text-destructive">
                    {errors[`contact-${method.id}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    family: {
      title: "Familienmitglieder",
      component: (
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label>Familienmitglieder</Label>
            <Button variant="outline" size="sm" onClick={handleAddFamilyMember}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Hinzufügen
            </Button>
          </div>

          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Label>Familienmitglied</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFamilyMember(member.id)}
                  >
                    Entfernen
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vorname</Label>
                    <Input
                      value={member.firstName}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          member.id,
                          "firstName",
                          e.target.value
                        )
                      }
                      placeholder="Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nachname</Label>
                    <Input
                      value={member.lastName}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          member.id,
                          "lastName",
                          e.target.value
                        )
                      }
                      placeholder="Mustermann"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rolle</Label>
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleFamilyMemberChange(
                        member.id,
                        "role",
                        value as FamilyMember["role"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Ehepartner/in</SelectItem>
                      <SelectItem value="parent">Elternteil</SelectItem>
                      <SelectItem value="children">Kind</SelectItem>
                      <SelectItem value="sibling">Geschwister</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(member.role === "children" || member.role === "sibling") && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`underage-${member.id}`}
                      checked={member.isUnderage}
                      onCheckedChange={(checked) =>
                        handleFamilyMemberChange(
                          member.id,
                          "isUnderage",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={`underage-${member.id}`}>
                      Minderjährig
                    </Label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    sepa: {
      title: "SEPA-Lastschriftmandat",
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-2 bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Mandatsreferenz:</span>
              <span className="font-mono">WILL-BE-GENERATED</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gläubiger-ID:</span>
              <span className="font-mono">DE12345678901</span>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Ich ermächtige den FV 1920 Stollhofen e.V., Zahlungen von meinem
              Konto mittels Lastschrift einzuziehen. Zugleich weise ich mein
              Kreditinstitut an, die vom FV 1920 Stollhofen e.V. auf mein Konto
              gezogenen Lastschriften einzulösen. Der Mitgliedsbeitrag wird
              jährlich zum 1. April eingezogen.
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Kontoinhaber</Label>
              <Input
                id="accountHolder"
                value={sepaData.accountHolder}
                onChange={(e) =>
                  handleSepaChange("accountHolder", e.target.value)
                }
                placeholder="Max Mustermann"
                className={cn(
                  "cursor-text",
                  errors.accountHolder && "border-destructive"
                )}
              />
              {errors.accountHolder && (
                <p className="text-sm text-destructive">
                  {errors.accountHolder}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={sepaData.iban}
                onChange={(e) => handleSepaChange("iban", e.target.value)}
                placeholder="DE12 3456 7890 1234 5678 90"
                className={cn(
                  "font-mono cursor-text",
                  errors.iban && "border-destructive"
                )}
              />
              {errors.iban && (
                <p className="text-sm text-destructive">{errors.iban}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic">BIC</Label>
              <Input
                id="bic"
                value={sepaData.bic}
                onChange={(e) =>
                  handleSepaChange("bic", e.target.value.toUpperCase())
                }
                placeholder="DEUTDEDB123"
                className={cn(
                  "font-mono uppercase cursor-text",
                  errors.bic && "border-destructive"
                )}
              />
              {errors.bic && (
                <p className="text-sm text-destructive">{errors.bic}</p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Hinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem
              Belastungsdatum, die Erstattung des belasteten Betrages verlangen.
              Es gelten dabei die mit meinem Kreditinstitut vereinbarten
              Bedingungen.
            </div>
          </div>
        </div>
      ),
    },
    confirm: {
      title: "Bestätigung",
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Checkbox
                id="contactData"
                checked={confirmations.contactData}
                onCheckedChange={() => handleConfirmationChange("contactData")}
              />
              <div>
                <Label
                  htmlFor="contactData"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ich bestätige die Richtigkeit meiner Kontakt- und persönlichen
                  Daten
                </Label>
                {errors.contactData && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.contactData}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="sepaMandate"
                checked={confirmations.sepaMandate}
                onCheckedChange={() => handleConfirmationChange("sepaMandate")}
              />
              <div>
                <Label
                  htmlFor="sepaMandate"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ich bestätige das{" "}
                  <a
                    href="/documents/sepa-mandate.pdf"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    SEPA-Lastschriftmandat
                  </a>{" "}
                  gelesen zu haben und akzeptiere es
                </Label>
                {errors.sepaMandate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.sepaMandate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="privacy"
                checked={confirmations.privacy}
                onCheckedChange={() => handleConfirmationChange("privacy")}
              />
              <div>
                <Label
                  htmlFor="privacy"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ich habe die{" "}
                  <a
                    href="/documents/privacy.pdf"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Datenschutz & Persönlichkeitsrechte
                  </a>{" "}
                  gelesen und akzeptiere diese
                </Label>
                {errors.privacy && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.privacy}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="dataProtection"
                checked={confirmations.dataProtection}
                onCheckedChange={() =>
                  handleConfirmationChange("dataProtection")
                }
              />
              <div>
                <Label
                  htmlFor="dataProtection"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ich bestätige die{" "}
                  <a
                    href="/documents/data-protection.pdf"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Informationspflicht nach Artikel 13 und 14 DSGVO
                  </a>{" "}
                  gelesen zu haben
                </Label>
                {errors.dataProtection && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.dataProtection}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Checkbox
                id="emailConsent"
                checked={confirmations.emailConsent}
                onCheckedChange={() => handleConfirmationChange("emailConsent")}
              />
              <div>
                <Label
                  htmlFor="emailConsent"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ich willige ein, dass der FV 1920 Stollhofen e.V. meine
                  E-Mail-Adresse zum Zweck der Kommunikation und Information
                  über Vereinsaktivitäten nutzen darf. Diese Einwilligung kann
                  ich jederzeit mit Wirkung für die Zukunft widerrufen.
                </Label>
                {errors.emailConsent && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.emailConsent}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  };

  // Get ordered array of steps based on membership type
  const stepSequence: Step[] = ["personal", "contact"];
  if (membershipType === "family") {
    stepSequence.push("family");
  }
  stepSequence.push("sepa", "confirm");

  const currentStepIndex = stepSequence.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepSequence.length - 1;

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case "personal":
        isValid = validatePersonalData();
        break;
      case "contact":
        isValid = validateContactData();
        break;
      case "family":
        isValid = validateFamilyData();
        break;
      case "sepa":
        isValid = validateSepaData();
        break;
      case "confirm":
        isValid = validateConfirmData();
        if (isValid) {
          // Handle form submission here
          console.log("Form submitted", {
            personalData,
            contactMethods,
            familyMembers,
            sepaData,
            confirmations,
          });
          setIsSubmitted(true);
          fireConfetti();
        }
        break;
    }

    if (isValid && !isLastStep) {
      const nextStep = stepSequence[currentStepIndex + 1];

      if (nextStep === "sepa") {
        setSepaData((prev) => ({
          ...prev,
          accountHolder:
            `${personalData.firstName} ${personalData.lastName}`.trim(),
        }));
      }

      setCurrentStep(nextStep);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(stepSequence[currentStepIndex - 1]);
    }
  };

  // Add success screen component
  const SuccessScreen = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="rounded-full bg-primary p-3 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Check className="h-12 w-12 text-primary-foreground" />
      </motion.div>
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Mitgliedschaft beantragt!
      </motion.h2>
      <motion.p
        className="text-muted-foreground mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Vielen Dank für deinen Antrag. Wir werden uns in Kürze bei dir melden.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={() => {
            setIsSubmitted(false);
            onClose();
          }}
          className="cursor-pointer"
        >
          Schließen
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {!isSubmitted ? (
          <>
            <div className="flex">
              {stepSequence.map((step, index) => (
                <div
                  key={step}
                  className={`h-1 flex-1 transition-colors ${
                    index <= currentStepIndex ? "bg-primary" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
            <div className="p-6">
              <DialogHeader>
                <DialogTitle>{steps[currentStep].title}</DialogTitle>
              </DialogHeader>

              {errors.contacts && (
                <p className="text-sm text-destructive mb-4">
                  {errors.contacts}
                </p>
              )}
              {errors.family && (
                <p className="text-sm text-destructive mb-4">{errors.family}</p>
              )}

              {steps[currentStep].component}

              <div className="flex justify-between gap-4 mt-4">
                <div>
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="cursor-pointer"
                    >
                      Zurück
                    </Button>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="cursor-pointer"
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={handleNext} className="cursor-pointer">
                    {isLastStep ? "Absenden" : "Weiter"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <SuccessScreen />
        )}
      </DialogContent>
    </Dialog>
  );
}

export { MembershipModal };
