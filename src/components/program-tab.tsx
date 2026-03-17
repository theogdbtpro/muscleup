
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Play, Dumbbell } from "lucide-react";
import ActiveSession from "./active-session";

type ProgramTabProps = {
  profile: UserProfile;
  onBack: () => void;
};

export default function ProgramTab({ profile, onBack }: ProgramTabProps) {
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const dayName = today.charAt(0).toUpperCase() + today.slice(1);
  const currentSession = program.sessions.find(s => s.day === dayName) || program.sessions[0];
  const [isActiveSessionOpen, setIsActiveSessionOpen] = useState(false);

  return (
    <div className="min-h-full bg-background flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white">Ma Séance</h1>
      </header>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="bg-secondary/50 rounded-3xl p-6 border border-zinc-800 mb-6">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">{dayName}</h2>
          <p className="text-2xl font-headline text-white">{currentSession.exercises.length} EXERCICES À COMPLÉTER</p>
        </div>

        {currentSession.exercises.map((ex, idx) => (
          <Card key={idx} className="p-4 bg-secondary border-none rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-primary">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">{ex.name}</h3>
              <p className="text-xs text-zinc-500 uppercase font-bold">{ex.sets} séries × {ex.reps}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={() => setIsActiveSessionOpen(true)}
          className="w-full h-16 rounded-2xl text-xl font-headline bg-primary text-white shadow-xl shadow-primary/20"
        >
          LANCER LA SÉANCE <Play className="ml-2 w-5 h-5 fill-current" />
        </Button>
      </div>

      {isActiveSessionOpen && (
        <ActiveSession 
          session={currentSession} 
          onClose={() => setIsActiveSessionOpen(false)}
          onFinish={() => {
            setIsActiveSessionOpen(false);
            onBack();
          }}
        />
      )}
    </div>
  );
}
