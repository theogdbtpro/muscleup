
"use client";

import { useState } from "react";
import { UserProfile, BodyProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dumbbell, Home, User, Target, ChevronRight } from "lucide-react";
import BodyProfileView from "./body-profile";

const PROGRAM_STYLES: Record<string, { color: string, shadow: string }> = {
  'gros-bras': { color: 'text-blue-400', shadow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]' },
  'pectoraux': { color: 'text-red-400', shadow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]' },
  'dos-large': { color: 'text-emerald-400', shadow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' },
  'full-body': { color: 'text-rose-400', shadow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]' },
  'jambes': { color: 'text-violet-400', shadow: 'drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
  'abdos': { color: 'text-amber-400', shadow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(-1); // -1 is Body Profile
  const [bodyProfile, setBodyProfile] = useState<BodyProfile | undefined>(undefined);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [level, setLevel] = useState("");
  const [frequency, setFrequency] = useState("");
  const [location, setLocation] = useState<'salle' | 'maison' | ''>("");

  const isFormValid = name && objective && level && frequency && location && bodyProfile;

  const nextStep = () => setStep(step + 1);

  if (step === -1) {
    return (
      <BodyProfileView 
        onSave={(data) => {
          setBodyProfile(data);
          nextStep();
        }}
        onBack={() => {}} // Can't go back from first step
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#0F0F0F] overflow-y-auto no-scrollbar pb-10">
      <div className="mt-8 mb-12 text-center">
        <h1 className="text-6xl font-headline text-[#E24B4A] tracking-tighter">MUSCLEUP</h1>
        <p className="text-zinc-500 font-medium uppercase text-xs tracking-widest mt-2">Forger ton corps, maintenant.</p>
      </div>

      <div className="space-y-12">
        {step === 0 && (
          <section className="fade-in">
            <h2 className="text-2xl font-headline text-white mb-6">0. TON LIEU D'ENTRAÎNEMENT</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setLocation('salle'); nextStep(); }}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 text-center",
                  location === 'salle' ? "bg-[#E24B4A]/10 border-[#E24B4A]" : "bg-[#1A1A1A] border-transparent"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-[#E24B4A]/20 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-[#E24B4A]" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white uppercase block">Salle de sport</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Machines & Haltères</span>
                </div>
              </button>
              <button
                onClick={() => { setLocation('maison'); nextStep(); }}
                className={cn(
                  "p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 text-center",
                  location === 'maison' ? "bg-[#E24B4A]/10 border-[#E24B4A]" : "bg-[#1A1A1A] border-transparent"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-[#E24B4A]/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#E24B4A]" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white uppercase block">À la maison</span>
                  <span className="text-[10px] text-zinc-500 uppercase">Poids du corps</span>
                </div>
              </button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="fade-in">
            <h2 className="text-2xl font-headline text-white mb-6">1. TON PRÉNOM</h2>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entre ton prénom ici..."
              className="bg-[#1A1A1A] border-[#2A2A2A] h-14 rounded-xl text-lg font-bold text-white focus:ring-[#E24B4A]"
              onKeyDown={(e) => e.key === 'Enter' && nextStep()}
            />
            <Button onClick={nextStep} disabled={!name} className="w-full h-14 mt-6 bg-[#E24B4A] text-white font-headline text-xl rounded-xl">CONTINUER</Button>
          </section>
        )}

        {step >= 2 && (
          <div className="space-y-12 fade-in">
            {/* Objectif */}
            <section>
              <h2 className="text-2xl font-headline text-white mb-6">2. TON OBJECTIF</h2>
              <div className="grid grid-cols-2 gap-4">
                {PROGRAMS.map((prog) => {
                  const style = PROGRAM_STYLES[prog.id] || { color: 'text-white', shadow: '' };
                  return (
                    <button
                      key={prog.id}
                      onClick={() => setObjective(prog.id)}
                      className={cn(
                        "p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-4 group relative overflow-hidden",
                        objective === prog.id
                          ? "bg-[#E24B4A]/10 border-[#E24B4A]"
                          : "bg-zinc-900/50 border-transparent hover:bg-zinc-800"
                      )}
                    >
                      <span className={cn("text-5xl transition-transform group-active:scale-90", style.shadow)}>
                        {prog.emoji}
                      </span>
                      <span className={cn(
                        "font-bold text-[10px] uppercase text-center tracking-widest",
                        objective === prog.id ? "text-white" : "text-zinc-600"
                      )}>
                        {prog.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Niveau */}
            <section>
              <h2 className="text-2xl font-headline text-white mb-6">3. TON NIVEAU</h2>
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
              <h2 className="text-2xl font-headline text-white mb-6">4. FRÉQUENCE / SEMAINE</h2>
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
        )}
      </div>

      {step >= 2 && (
        <div className="mt-16 sticky bottom-0 pt-4 bg-[#0F0F0F]">
          <Button
            disabled={!isFormValid}
            onClick={() => {
              onComplete({ 
                name, 
                objective, 
                level, 
                frequency, 
                location: location as any, 
                onboarded: true,
                bodyProfile 
              });
            }}
            className="w-full h-14 rounded-xl text-xl font-headline bg-[#E24B4A] hover:bg-[#E24B4A]/90 text-white shadow-xl shadow-[#E24B4A]/20"
          >
            COMMENCER MON PROGRAMME
          </Button>
        </div>
      )}
    </div>
  );
}
