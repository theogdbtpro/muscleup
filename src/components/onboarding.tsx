
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowLeft } from "lucide-react";

type OnboardingProps = {
  onComplete: (profile: UserProfile) => void;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [frequency, setFrequency] = useState("");

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const progress = (step / 3) * 100;

  return (
    <div className="flex-1 flex flex-col p-6 bg-background fade-in">
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-zinc-800" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">
          <span>Objectif</span>
          <span>Niveau</span>
          <span>Fréquence</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {step === 1 && (
          <div className="fade-in flex-1 flex flex-col">
            <h1 className="text-4xl mb-2 text-primary font-headline">Ton Objectif</h1>
            <p className="text-muted-foreground mb-8">Choisis la zone que tu souhaites transformer en priorité.</p>
            <div className="grid grid-cols-2 gap-4">
              {PROGRAMS.map((prog) => (
                <button
                  key={prog.id}
                  onClick={() => setObjective(prog.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200",
                    objective === prog.id
                      ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(226,75,74,0.3)]"
                      : "bg-secondary border-transparent hover:border-zinc-700"
                  )}
                >
                  <span className="text-4xl mb-3">{prog.emoji}</span>
                  <span className="font-semibold text-center text-sm">{prog.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in flex-1 flex flex-col">
            <button onClick={prevStep} className="mb-6 flex items-center text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </button>
            <h1 className="text-4xl mb-2 text-primary font-headline">Ton Niveau</h1>
            <p className="text-muted-foreground mb-8">Sois honnête, on s'adapte à toi.</p>
            <div className="flex flex-col gap-4">
              {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all duration-200",
                    level === l
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary border-transparent"
                  )}
                >
                  <span className="font-bold text-lg block">{l}</span>
                  <span className="text-xs text-muted-foreground">
                    {l === "Débutant" && "Moins de 6 mois de pratique."}
                    {l === "Intermédiaire" && "Entre 6 mois et 2 ans de pratique."}
                    {l === "Avancé" && "Plus de 2 ans d'entraînement intense."}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in flex-1 flex flex-col">
            <button onClick={prevStep} className="mb-6 flex items-center text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </button>
            <h1 className="text-4xl mb-2 text-primary font-headline">Fréquence</h1>
            <p className="text-muted-foreground mb-8">Combien de jours par semaine peux-tu dédier au sport ?</p>
            <div className="grid grid-cols-2 gap-4">
              {["2j", "3j", "4j", "5j"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={cn(
                    "p-6 rounded-2xl border text-center transition-all duration-200",
                    frequency === f
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary border-transparent"
                  )}
                >
                  <span className="font-headline text-2xl block">{f}</span>
                  <span className="text-xs text-muted-foreground uppercase">par semaine</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <Button
          disabled={
            (step === 1 && !objective) ||
            (step === 2 && !level) ||
            (step === 3 && !frequency)
          }
          onClick={() => {
            if (step < 3) nextStep();
            else onComplete({ objective, level, frequency, onboarded: true });
          }}
          className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-white"
        >
          {step === 3 ? "COMMENCER MON PROGRAMME" : "CONTINUER"}
          {step < 3 && <ChevronRight className="ml-2 w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
