"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type OnboardingProps = {
  onComplete: (profile: UserProfile) => void;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [frequency, setFrequency] = useState("");

  const isFormValid = name && objective && level && frequency;

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#0F0F0F] overflow-y-auto no-scrollbar pb-10">
      <div className="mt-8 mb-12 text-center">
        <h1 className="text-6xl font-headline text-[#E24B4A] tracking-tighter">MUSCLEUP</h1>
        <p className="text-zinc-500 font-medium uppercase text-xs tracking-widest mt-2">Forger ton corps, maintenant.</p>
      </div>

      <div className="space-y-12">
        {/* Prénom */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-6">0. TON PRÉNOM</h2>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entre ton prénom ici..."
            className="bg-[#1A1A1A] border-[#2A2A2A] h-14 rounded-xl text-lg font-bold text-white focus:ring-[#E24B4A]"
          />
        </section>

        {/* Objectif */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-6">1. TON OBJECTIF</h2>
          <div className="grid grid-cols-2 gap-4">
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => setObjective(prog.id)}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3",
                  objective === prog.id
                    ? "bg-[#E24B4A]/10 border-[#E24B4A] text-white"
                    : "bg-[#1A1A1A] border-transparent text-zinc-500"
                )}
              >
                <span className="text-4xl">{prog.emoji}</span>
                <span className="font-bold text-[10px] uppercase text-center tracking-tight">{prog.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Niveau */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-6">2. TON NIVEAU</h2>
          <div className="grid grid-cols-3 gap-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase",
                  level === l
                    ? "bg-[#E24B4A]/10 border-[#E24B4A] text-white"
                    : "bg-[#1A1A1A] border-transparent text-zinc-500"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* Fréquence */}
        <section>
          <h2 className="text-2xl font-headline text-white mb-6">3. FRÉQUENCE PAR SEMAINE</h2>
          <div className="grid grid-cols-4 gap-3">
            {["2j", "3j", "4j", "5j"].map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={cn(
                  "h-16 rounded-xl border-2 transition-all flex items-center justify-center font-headline text-2xl",
                  frequency === f
                    ? "bg-[#E24B4A]/10 border-[#E24B4A] text-white"
                    : "bg-[#1A1A1A] border-transparent text-zinc-500"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 sticky bottom-0 pt-4 bg-[#0F0F0F]">
        <Button
          disabled={!isFormValid}
          onClick={() => {
            localStorage.setItem('userName', name);
            onComplete({ name, objective, level, frequency, onboarded: true });
          }}
          className="w-full h-14 rounded-xl text-xl font-headline bg-[#E24B4A] hover:bg-[#E24B4A]/90 text-white shadow-xl shadow-[#E24B4A]/20"
        >
          COMMENCER MON PROGRAMME
        </Button>
      </div>
    </div>
  );
}
