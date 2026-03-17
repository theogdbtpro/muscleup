"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Activity, Utensils, MessageSquare, ChevronRight } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
};

export default function Hub({ profile, setView }: HubProps) {
  const [history, setHistory] = useState<any[]>([]);
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const currentDayIdx = (new Date().getDay() + 6) % 7; // Lundi = 0

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
    // Logique simplifiée pour l'affichage
    return history.length;
  }, [history]);

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline text-white leading-none">Bonjour Athlète</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase mt-1 tracking-widest">C'est le moment de briller</p>
        </div>
        <div className="bg-[#E24B4A]/10 px-4 py-2 rounded-full flex items-center gap-2 border border-[#E24B4A]/20">
          <Flame className="w-4 h-4 text-[#E24B4A] fill-[#E24B4A]" />
          <span className="text-sm font-bold text-white tracking-tighter">🔥 {streak} JOURS</span>
        </div>
      </header>

      {/* Hero Card Workout */}
      <Card className={cn(
        "p-8 rounded-2xl border-none relative overflow-hidden shadow-2xl transition-all",
        finishedToday ? "bg-[#1A1A1A]" : "bg-[#E24B4A]"
      )}>
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-2", finishedToday ? "text-zinc-500" : "text-white/70")}>Séance du jour</h3>
            <h4 className="text-4xl font-headline text-white leading-tight">
              {finishedToday ? "BRAVO CHAMPION !" : program.sessions[0].name}
            </h4>
            <p className={cn("font-medium text-sm", finishedToday ? "text-zinc-400" : "text-white/80")}>
              {finishedToday ? "Séance terminée ✓ Ton corps te remercie." : "Durée estimée : 45-50 min"}
            </p>
          </div>
          {!finishedToday && (
            <Button 
              onClick={() => setView("programme")}
              className="w-full h-14 bg-white text-[#E24B4A] rounded-xl text-lg font-headline hover:bg-white/90 shadow-xl"
            >
              C'EST PARTI !
            </Button>
          )}
        </div>
      </Card>

      {/* Days Week Row */}
      <div className="flex justify-between">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-600">{day}</span>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2",
              i === currentDayIdx 
                ? "border-[#E24B4A] bg-[#E24B4A]/10 text-white" 
                : "border-[#2A2A2A] bg-[#1A1A1A] text-zinc-600"
            )}>
              <div className={cn("w-2 h-2 rounded-full", i === currentDayIdx ? "bg-[#E24B4A]" : "bg-transparent")} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Menu */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setView("progres")}
          className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
        >
          <Activity className="w-6 h-6 text-[#EE3BAA]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
        </button>
        <button 
          onClick={() => setView("nutrition")}
          className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
        >
          <Utensils className="w-6 h-6 text-[#E24B4A]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
        </button>
        <button 
          onClick={() => setView("coach")}
          className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors"
        >
          <MessageSquare className="w-6 h-6 text-green-500" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Coach IA</span>
        </button>
      </div>

      {/* Footer Banner */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 flex justify-between items-center group cursor-pointer" onClick={() => setView("progres")}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#E24B4A]/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#E24B4A]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-tight">Vérifier tes progrès</div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Dernière séance il y a 2h</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-[#E24B4A] transition-colors" />
      </div>
    </div>
  );
}