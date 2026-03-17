
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type OnboardingProps = {
  onComplete: (profile: UserProfile) => void;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [frequency, setFrequency] = useState("");

  const isFormValid = objective && level && frequency;

  return (
    <div className="flex-1 flex flex-col p-6 bg-background overflow-y-auto no-scrollbar pb-10">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-headline text-primary mb-2">MUSCLEUP</h1>
        <p className="text-zinc-400 text-lg">Ton nouveau corps commence ici.</p>
      </div>

      <div className="space-y-10">
        {/* Objectif */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-4">1. TON OBJECTIF</h2>
          <div className="grid grid-cols-2 gap-3">
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => setObjective(prog.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                  objective === prog.id
                    ? "bg-primary/10 border-primary text-white"
                    : "bg-secondary border-transparent text-zinc-500"
                )}
              >
                <span className="text-3xl">{prog.emoji}</span>
                <span className="font-bold text-xs uppercase text-center">{prog.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Niveau */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-4">2. TON NIVEAU</h2>
          <div className="space-y-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "w-full p-5 rounded-2xl border-2 transition-all flex justify-between items-center",
                  level === l
                    ? "bg-primary/10 border-primary text-white"
                    : "bg-secondary border-transparent text-zinc-500"
                )}
              >
                <span className="font-bold">{l}</span>
                {level === l && <Check className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>
        </section>

        {/* Fréquence */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-4">3. FRÉQUENCE</h2>
          <div className="grid grid-cols-4 gap-2">
            {["2j", "3j", "4j", "5j"].map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={cn(
                  "aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center",
                  frequency === f
                    ? "bg-primary/10 border-primary text-white"
                    : "bg-secondary border-transparent text-zinc-500"
                )}
              >
                <span className="font-headline text-2xl">{f}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12">
        <Button
          disabled={!isFormValid}
          onClick={() => onComplete({ objective, level, frequency, onboarded: true })}
          className="w-full h-16 rounded-2xl text-xl font-headline bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
        >
          COMMENCER
        </Button>
      </div>
    </div>
  );
}
