"use client";

import { useMemo, useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MonthlyPlanningProps = {
  profile: UserProfile;
  onBack: () => void;
  onStartSession: (sessionId?: string) => void;
};

const MONTHS_FULL = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_SHORT = ["L","M","M","J","V","S","D"];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const SESSION_COLORS = [
  "bg-[#E24B4A]/20 text-[#E24B4A] border-[#E24B4A]/40",
  "bg-[#EE3BAA]/20 text-[#EE3BAA] border-[#EE3BAA]/40",
  "bg-blue-500/20 text-blue-400 border-blue-500/40",
  "bg-amber-500/20 text-amber-400 border-amber-500/40",
  "bg-green-500/20 text-green-400 border-green-500/40",
  "bg-purple-500/20 text-purple-400 border-purple-500/40",
];

export default function MonthlyPlanning({ profile, onBack, onStartSession }: MonthlyPlanningProps) {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const program = useMemo(() => PROGRAMS.find(p => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);

  const sessions = useMemo(() => program.sessions.filter(s => !s.isRestDay), [program]);

  const sessionColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    sessions.forEach((s, i) => { map[s.id] = SESSION_COLORS[i % SESSION_COLORS.length]; });
    return map;
  }, [sessions]);

  // Récupère le planning sauvegardé
  const baseSchedule = useMemo<Record<string, string | null>>(() => {
    if (typeof window === 'undefined') return {};
    const manual = localStorage.getItem("muscleup_manual_schedule");
    if (manual) return JSON.parse(manual);
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const mapping: Record<string, string | null> = {};
    dayNamesFull.forEach(d => {
      const s = program.sessions.find(ps => ps.day === d);
      mapping[d] = s ? s.id : null;
    });
    return mapping;
  }, [program]);

  const completedDates = useMemo<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem("completedDates") || "[]");
  }, []);

  const customNames = useMemo<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem("muscleup_session_names") || "{}");
  }, []);

  const getSessionName = (sessionId: string) => {
    const found = sessions.find((sess) => sess.id === sessionId);
    if (!found) return null;
    return customNames[found.id] || found.name;
  };

  // Calcul du mois affiché
  const displayDate = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [monthOffset]);

  // Jours du mois
  const daysInMonth = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

    // Padding avant le 1er jour
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // 0=Lundi
    const days: (Date | null)[] = Array(firstDayOfWeek).fill(null);

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [displayDate]);

  // Obtenir la séance prévue pour une date
  const getSessionForDate = (date: Date): string | null => {
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const dayIdx = (date.getDay() + 6) % 7;
    const dayName = dayNamesFull[dayIdx];

    // Rotation selon semaine
    const weekNum = getWeekNumber(date);
    const trainingDays = dayNamesFull.filter(d => baseSchedule[d]);
    if (trainingDays.length === 0) return null;

    const rotation = weekNum % sessions.length;
    const dayPosition = trainingDays.indexOf(dayName);
    if (dayPosition === -1) return null;

    const sessionIdx = (dayPosition + rotation) % sessions.length;
    return sessions[sessionIdx]?.id || null;
  };

  const selectedSession = selectedDay ? getSessionForDate(selectedDay) : null;
  const selectedSessionObj = selectedSession ? sessions.find(s => s.id === selectedSession) : null;
  const isSelectedDone = selectedDay ? completedDates.includes(selectedDay.toISOString().split('T')[0]) : false;
  const isSelectedToday = selectedDay ? selectedDay.toISOString().split('T')[0] === today.toISOString().split('T')[0] : false;

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white press-effect">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-headline text-white uppercase">{MONTHS_FULL[displayDate.getMonth()]}</h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{displayDate.getFullYear()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMonthOffset(m => m - 1)}
            className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setMonthOffset(m => m + 1)}
            className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Légende des séances */}
      <div className="px-6 mb-4">
        <div className="flex flex-wrap gap-2">
          {sessions.map(s => (
            <span key={s.id} className={cn("px-2 py-1 text-[9px] font-bold uppercase rounded-md border", sessionColorMap[s.id])}>
              {customNames[s.id] || s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Grille du calendrier */}
      <div className="px-4 flex-1">
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_SHORT.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-zinc-600 uppercase py-1">{d}</div>
          ))}
        </div>

        {/* Cases du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} />;

            const dateStr = date.toISOString().split('T')[0];
            const sessionId = getSessionForDate(date);
            const isDone = completedDates.includes(dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isPast = date < today && !isToday;
            const isSelected = selectedDay?.toISOString().split('T')[0] === dateStr;

            return (
              <button key={dateStr}
                onClick={() => setSelectedDay(isSelected ? null : date)}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all press-effect",
                  isSelected ? "ring-2 ring-white scale-105" : "",
                  isToday ? "ring-2 ring-[#E24B4A]" : "",
                  sessionId && isDone ? "bg-green-500/20" :
                  sessionId ? (sessionColorMap[sessionId] + " border") :
                  "bg-[#1A1A1A]",
                  isPast && !sessionId ? "opacity-30" : "",
                )}>
                <span className={cn(
                  "text-xs font-bold",
                  isToday ? "text-[#E24B4A]" : sessionId ? "" : "text-zinc-600"
                )}>
                  {date.getDate()}
                </span>
                {isDone && (
                  <div className="w-1 h-1 rounded-full bg-green-400 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Détail du jour sélectionné */}
      {selectedDay && (
        <div className="mx-4 mt-4 mb-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 animate-in slide-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h3 className="text-xl font-headline text-white uppercase mt-0.5">
                {selectedSession ? (customNames[selectedSession] || selectedSessionObj?.name) : "Repos"}
              </h3>
            </div>
            {isSelectedDone && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded-md border border-green-500/30">
                ✓ Fait
              </span>
            )}
          </div>

          {selectedSessionObj && (
            <div className="space-y-1 mb-4">
              {selectedSessionObj.exercises.slice(0, 3).map((ex, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="w-1 h-1 rounded-full bg-[#E24B4A] shrink-0" />
                  <span className="font-bold text-zinc-300 uppercase">{ex.name}</span>
                  <span className="text-zinc-600">{ex.sets}×{ex.reps}</span>
                </div>
              ))}
              {selectedSessionObj.exercises.length > 3 && (
                <p className="text-[10px] text-zinc-600 pl-3">+{selectedSessionObj.exercises.length - 3} exercices</p>
              )}
            </div>
          )}

          {selectedSession && !isSelectedDone && (isSelectedToday || true) && (
            <Button onClick={() => onStartSession(selectedSession)}
              className="w-full h-12 bg-[#E24B4A] text-white font-headline text-lg rounded-xl press-effect ripple flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              {isSelectedToday ? "C'EST PARTI !" : "LANCER CETTE SÉANCE"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}