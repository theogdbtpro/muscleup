"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Activity, Utensils, MessageSquare, ChevronRight, Lightbulb, CheckCircle2, Circle } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
};

const OBJECTIVE_TIPS: Record<string, string> = {
  "gros-bras": "Focus sur la contraction volontaire, ne balance pas les charges !",
  "pectoraux": "Garde les omoplates serrées sur le banc pour protéger tes épaules.",
  "dos-large": "Imagine que tu tires avec tes coudes, pas avec tes mains.",
  "full-body": "Priorise les mouvements polyarticulaires pour brûler plus de calories.",
  "jambes": "Descends au moins jusqu'à la parallèle pour engager les fessiers.",
  "abdos": "La sangle abdominale se forge aussi dans l'assiette, reste hydraté."
};

export default function Hub({ profile, setView }: HubProps) {
  const [history, setHistory] = useState<any[]>([]);
  
  // Correction 1 : Trouver le vrai programme
  const program = useMemo(() => {
    return PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  }, [profile.objective]);

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
    // Logique simplifiée : nombre de séances totales pour cet exercice de style
    return history.length;
  }, [history]);

  // Déterminer le statut des jours de la semaine
  const dayStatuses = useMemo(() => {
    const statuses = new Array(7).fill("upcoming");
    const todayStr = new Date().toISOString().split('T')[0];
    
    // On vérifie dans l'historique quels jours ont été complétés cette semaine
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);
    monday.setHours(0,0,0,0);

    history.forEach(h => {
      const hDate = new Date(h.date);
      if (hDate >= monday) {
        const dayIdx = (hDate.getDay() + 6) % 7;
        statuses[dayIdx] = "done";
      }
    });

    return statuses;
  }, [history, currentDayIdx]);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-20">
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

      {/* Hero Card Workout - Correction 1 */}
      <Card className={cn(
        "p-8 rounded-2xl border-none relative overflow-hidden shadow-2xl transition-all",
        finishedToday ? "bg-[#1A4A2A]" : "bg-[#E24B4A]"
      )}>
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className={cn("text-xs font-bold uppercase tracking-widest mb-2", finishedToday ? "text-green-400" : "text-white/70")}>
              {finishedToday ? "Bravo !" : "Séance du jour"}
            </h3>
            <h4 className="text-4xl font-headline text-white leading-tight uppercase">
              {finishedToday ? "SÉANCE TERMINÉE ✓" : `${program.name} — ${profile.level}`}
            </h4>
            <p className={cn("font-medium text-sm", finishedToday ? "text-green-200" : "text-white/80")}>
              {finishedToday ? "Ton corps te remercie. Repose-toi bien !" : `Durée estimée : ${program.sessions[0].duration}`}
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

      {/* Days Week Row - Correction 2 */}
      <div className="flex justify-between items-end px-1">
        {days.map((day, i) => {
          const isToday = i === currentDayIdx;
          const isDone = dayStatuses[i] === "done";
          const session = program.sessions.find(s => {
            const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            return s.day === dayNames[i];
          });
          const isRest = !session || session.isRestDay;

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "rounded-full flex items-center justify-center transition-all duration-300 border",
                isToday 
                  ? "w-[44px] h-[44px] bg-[#E24B4A] border-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/20" 
                  : isDone 
                    ? "w-[40px] h-[40px] bg-[#1A4A2A] border-[#4CAF50] text-[#4CAF50]"
                    : isRest
                      ? "w-[40px] h-[40px] bg-[#1A1A1A] border-[#2A2A2A] text-zinc-600"
                      : "w-[40px] h-[40px] bg-[#1A1A1A] border-[#2A2A2A] text-zinc-400"
              )}>
                <span className={cn("font-headline text-xl", isToday ? "scale-110" : "")}>
                  {day}
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{day}</span>
            </div>
          );
        })}
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

      {/* Correction 3 : Section Conseil du jour */}
      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide">CONSEIL DU JOUR</h2>
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-300 leading-relaxed italic">
              "{OBJECTIVE_TIPS[profile.objective] || "Reste constant, les résultats viendront avec le temps."}"
            </p>
          </div>
        </Card>
      </section>

      {/* Correction 3 : Section Programme de la semaine */}
      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide">PROGRAMME DE LA SEMAINE</h2>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((dayName, idx) => {
            const session = program.sessions.find(s => s.day === dayName);
            const isDone = dayStatuses[idx] === "done";
            const isToday = idx === currentDayIdx;

            return (
              <div 
                key={dayName} 
                className={cn(
                  "p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0",
                  isToday ? "bg-[#E24B4A]/5" : ""
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn("text-xs font-bold w-8", isToday ? "text-[#E24B4A]" : "text-zinc-600")}>
                    {dayName.slice(0, 3)}
                  </span>
                  <div>
                    <div className={cn("text-sm font-bold uppercase tracking-tight", isToday ? "text-white" : "text-zinc-400")}>
                      {!session || session.isRestDay ? "Repos" : session.name}
                    </div>
                  </div>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-800" />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
