
"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Activity, Utensils, MessageSquare, ArrowRight } from "lucide-react";
import { useMemo, useEffect, useState } from "react";

type HubProps = {
  profile: UserProfile;
  setView: (view: "hub" | "program" | "progress" | "nutrition" | "coach") => void;
};

export default function Hub({ profile, setView }: HubProps) {
  const [history, setHistory] = useState<any[]>([]);
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const dayName = today.charAt(0).toUpperCase() + today.slice(1);
  const currentSession = program.sessions.find(s => s.day === dayName) || program.sessions[0];

  useEffect(() => {
    const saved = localStorage.getItem("muscleup_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const finishedToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return history.some(h => h.date && h.date.split('T')[0] === todayStr);
  }, [history]);

  const streak = useMemo(() => {
    if (history.length === 0) return 0;
    // Simple logic for the streak display on hub
    return Math.min(history.length, 7); // Placeholder logic for UI
  }, [history]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-zinc-500 text-sm font-bold uppercase tracking-widest">BIENVENUE</h1>
        <div className="flex justify-between items-end">
          <h2 className="text-4xl font-headline text-white leading-none">Vise le sommet</h2>
          <span className="text-zinc-500 text-xs font-bold uppercase">{dayName}</span>
        </div>
      </header>

      {/* Hero Card Workout */}
      <Card className={`p-8 rounded-[2.5rem] border-none relative overflow-hidden shadow-2xl transition-all ${finishedToday ? 'bg-zinc-900' : 'bg-primary'}`}>
        {!finishedToday ? (
          <div className="relative z-10 space-y-6">
            <div>
              <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">Séance du jour</h3>
              <h4 className="text-5xl font-headline text-white leading-tight">{currentSession.day === dayName ? currentSession.day : "PRÊT ?"}</h4>
              <p className="text-white/80 font-medium">{currentSession.isRestDay ? "Jour de repos" : `${currentSession.exercises.length} exercices prévus`}</p>
            </div>
            {!currentSession.isRestDay && (
              <Button 
                onClick={() => setView("program")}
                className="w-full h-16 bg-white text-primary rounded-2xl text-xl font-headline hover:bg-white/90 shadow-xl"
              >
                C'EST PARTI !
              </Button>
            )}
          </div>
        ) : (
          <div className="relative z-10 text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Activity className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-3xl font-headline text-white">Séance terminée !</h3>
            <p className="text-zinc-400">Bravo, ton corps te remercie. ✓</p>
          </div>
        )}
      </Card>

      {/* Grid Menu */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setView("progress")}
          className="bg-secondary p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Activity className="w-6 h-6 text-accent" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
        </button>
        <button 
          onClick={() => setView("nutrition")}
          className="bg-secondary p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <Utensils className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
        </button>
        <button 
          onClick={() => setView("coach")}
          className="bg-secondary p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <MessageSquare className="w-6 h-6 text-green-500" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Coach IA</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="bg-secondary/40 border border-zinc-800 rounded-[2rem] p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-headline text-white">{streak} jours</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Streak actuel</div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-zinc-700" />
      </div>
    </div>
  );
}
