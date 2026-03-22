"use client";

import { useMemo, useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { ChevronLeft, ChevronRight, Play, CheckCircle2, Circle, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MonthlyPlanningProps = {
  profile: UserProfile;
  onBack: () => void;
  onStartSession: (sessionId?: string) => void;
};

const MONTHS_FULL = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_SHORT = ["L","M","M","J","V","S","D"];
const DAYS_FULL = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default function MonthlyPlanning({ profile, onBack, onStartSession }: MonthlyPlanningProps) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number | null>(null);

  const program = useMemo(() => PROGRAMS.find(p => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);
  const sessions = useMemo(() => program.sessions.filter(s => !s.isRestDay), [program]);

  const baseSchedule = useMemo<Record<string, string | null>>(() => {
    if (typeof window === 'undefined') return {};
    const base = localStorage.getItem("muscleup_base_schedule");
    if (base) return JSON.parse(base);
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    const mapping: Record<string, string | null> = {};
    DAYS_FULL.forEach(d => {
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
    const found = sessions.find(s => s.id === sessionId);
    if (!found) return null;
    return customNames[found.id] || found.name;
  };

  const getSessionForDate = (date: Date): string | null => {
    const dayIdx = (date.getDay() + 6) % 7;
    const dayName = DAYS_FULL[dayIdx];
    const trainingDays = DAYS_FULL.filter(d => baseSchedule[d]);
    if (trainingDays.length === 0) return null;
    const weekNum = getWeekNumber(date);
    const rotation = weekNum % sessions.length;
    const dayPosition = trainingDays.indexOf(dayName);
    if (dayPosition === -1) return null;
    const sessionIdx = (dayPosition + rotation) % sessions.length;
    return sessions[sessionIdx]?.id || null;
  };

  const displayDate = useMemo(() => {
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  // Génère les semaines du mois
  const weeks = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const allDays: (Date | null)[] = [
      ...Array(firstDayOfWeek).fill(null),
    ];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      allDays.push(new Date(year, month, i));
    }
    // Compléter jusqu'à un multiple de 7
    while (allDays.length % 7 !== 0) allDays.push(null);

    const result = [];
    for (let i = 0; i < allDays.length; i += 7) {
      result.push(allDays.slice(i, i + 7));
    }
    return result;
  }, [displayDate]);

  // Stats du mois
  const monthStats = useMemo(() => {
    const planned = weeks.flat().filter(d => d && getSessionForDate(d)).length;
    const done = weeks.flat().filter(d => {
      if (!d) return false;
      const ds = d.toISOString().split('T')[0];
      return completedDates.includes(ds) && getSessionForDate(d);
    }).length;
    return { planned, done };
  }, [weeks, completedDates]);

  const selectedWeek = selectedWeekIdx !== null ? weeks[selectedWeekIdx] : null;

  // Stats de la semaine sélectionnée
  const weekStats = useMemo(() => {
    if (!selectedWeek) return null;
    const days = selectedWeek.filter(Boolean) as Date[];
    const planned = days.filter(d => getSessionForDate(d)).length;
    const done = days.filter(d => {
      const ds = d.toISOString().split('T')[0];
      return completedDates.includes(ds) && getSessionForDate(d);
    }).length;
    const weekNum = days[0] ? getWeekNumber(days[0]) : 0;
    return { planned, done, weekNum };
  }, [selectedWeek, completedDates]);

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-headline text-white uppercase">{MONTHS_FULL[displayDate.getMonth()]}</h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{displayDate.getFullYear()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setMonthOffset(m => m - 1); setSelectedWeekIdx(null); }}
            className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => { setMonthOffset(m => m + 1); setSelectedWeekIdx(null); }}
            className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats du mois */}
      <div className="px-6 mb-4 grid grid-cols-3 gap-3">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-center">
          <div className="text-2xl font-headline text-white">{monthStats.planned}</div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Prévues</div>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-center">
          <div className="text-2xl font-headline text-green-400">{monthStats.done}</div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Faites</div>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 text-center">
          <div className="text-2xl font-headline text-[#E24B4A]">{monthStats.planned - monthStats.done}</div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Restantes</div>
        </div>
      </div>

      {/* Calendrier - en-têtes jours */}
      <div className="px-4">
        <div className="grid grid-cols-8 mb-1">
          <div className="text-[9px] font-bold text-zinc-700 uppercase text-center py-1">Sem.</div>
          {DAYS_SHORT.map((d, i) => (
            <div key={i} className="text-center text-[9px] font-bold text-zinc-600 uppercase py-1">{d}</div>
          ))}
        </div>

        {/* Semaines */}
        <div className="space-y-1">
          {weeks.map((week, wIdx) => {
            const validDays = week.filter(Boolean) as Date[];
            if (validDays.length === 0) return null;
            const weekNum = getWeekNumber(validDays[0]);
            const weekDone = validDays.filter(d => {
              const ds = d.toISOString().split('T')[0];
              return completedDates.includes(ds) && getSessionForDate(d);
            }).length;
            const weekPlanned = validDays.filter(d => getSessionForDate(d)).length;
            const isSelected = selectedWeekIdx === wIdx;
            const hasToday = validDays.some(d => d.toISOString().split('T')[0] === todayStr);

            return (
              <button
                key={wIdx}
                onClick={() => setSelectedWeekIdx(isSelected ? null : wIdx)}
                className={cn(
                  "w-full grid grid-cols-8 rounded-xl transition-all",
                  isSelected ? "bg-[#2A2A2A] ring-1 ring-[#E24B4A]/50" : "hover:bg-[#1A1A1A]",
                )}
              >
                {/* Numéro de semaine + stats */}
                <div className="flex flex-col items-center justify-center py-2">
                  <span className={cn("text-[9px] font-bold", hasToday ? "text-[#E24B4A]" : "text-zinc-700")}>S{weekNum}</span>
                  {weekPlanned > 0 && (
                    <span className="text-[8px] font-bold text-zinc-600">{weekDone}/{weekPlanned}</span>
                  )}
                </div>

                {/* Jours */}
                {week.map((date, dIdx) => {
                  if (!date) return <div key={dIdx} className="aspect-square" />;
                  const dateStr = date.toISOString().split('T')[0];
                  const sessionId = getSessionForDate(date);
                  const isDone = completedDates.includes(dateStr);
                  const isToday = dateStr === todayStr;
                  const isPast = date < today && !isToday;

                  return (
                    <div key={dateStr} className={cn(
                      "aspect-square flex flex-col items-center justify-center relative m-0.5 rounded-lg",
                      sessionId && isDone ? "bg-green-500/20" :
                      sessionId && isToday ? "bg-[#E24B4A]/20" :
                      sessionId ? "bg-[#E24B4A]/10" :
                      "bg-transparent",
                      isToday ? "ring-1 ring-[#E24B4A]" : "",
                      isPast && !sessionId ? "opacity-30" : "",
                    )}>
                      <span className={cn(
                        "text-[11px] font-bold leading-none",
                        isToday ? "text-[#E24B4A]" :
                        sessionId && isDone ? "text-green-400" :
                        sessionId ? "text-white" :
                        "text-zinc-600"
                      )}>
                        {date.getDate()}
                      </span>
                      {sessionId && (
                        <div className={cn(
                          "w-1 h-1 rounded-full mt-0.5",
                          isDone ? "bg-green-400" : "bg-[#E24B4A]"
                        )} />
                      )}
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="px-6 mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#E24B4A]/20 border border-[#E24B4A]/40" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase">Prévu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase">Fait</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full ring-1 ring-[#E24B4A]" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase">Aujourd'hui</span>
        </div>
      </div>

      {/* Détail semaine sélectionnée */}
      {selectedWeek && weekStats && (
        <div className="mx-4 mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
          
          {/* Header semaine */}
          <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
            <h3 className="text-sm font-headline text-white uppercase">Semaine {weekStats.weekNum}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-green-400">{weekStats.done} faite{weekStats.done > 1 ? 's' : ''}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-[10px] font-bold text-zinc-400">{weekStats.planned} prévue{weekStats.planned > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Jours de la semaine */}
          <div className="divide-y divide-[#2A2A2A]">
            {selectedWeek.map((date, dIdx) => {
              if (!date) return null;
              const dateStr = date.toISOString().split('T')[0];
              const sessionId = getSessionForDate(date);
              const sessionObj = sessionId ? sessions.find(s => s.id === sessionId) : null;
              const isDone = completedDates.includes(dateStr);
              const isToday = dateStr === todayStr;
              const isPast = date < today && !isToday;
              const sessionName = sessionId ? getSessionName(sessionId) : null;

              return (
                <div key={dateStr} className={cn(
                  "p-3 flex items-center gap-3",
                  isToday ? "bg-[#E24B4A]/5" : "",
                  isDone ? "bg-green-500/5" : "",
                )}>
                  {/* Date */}
                  <div className="w-12 shrink-0">
                    <div className={cn("text-[10px] font-bold uppercase", isToday ? "text-[#E24B4A]" : "text-zinc-500")}>
                      {DAYS_FULL[dIdx].slice(0, 3)}
                    </div>
                    <div className="text-[9px] text-zinc-700 font-bold">{date.getDate()}</div>
                  </div>

                  {/* Séance ou repos */}
                  {sessionId && sessionObj ? (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-bold uppercase tracking-tight", isDone ? "text-green-400" : isToday ? "text-white" : isPast ? "text-zinc-500" : "text-zinc-300")}>
                          {sessionName}
                        </div>
                        <div className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">
                          {sessionObj.exercises.length} exercices · {sessionObj.duration}
                        </div>
                      </div>

                      {/* Status + bouton */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isDone ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-[9px] font-bold text-green-400 uppercase">Validé</span>
                          </div>
                        ) : isToday ? (
                          <button onClick={() => onStartSession(sessionId)}
                            className="bg-[#E24B4A] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1">
                            <Play className="w-3 h-3" /> Go
                          </button>
                        ) : !isPast ? (
                          <button onClick={() => onStartSession(sessionId)}
                            className="bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1 hover:border-[#E24B4A] hover:text-white transition-all">
                            <Play className="w-3 h-3" /> Lancer
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-700 uppercase">—</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <span className="text-sm font-bold uppercase tracking-tight text-zinc-700">Repos</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message si aucune semaine sélectionnée */}
      {!selectedWeek && (
        <div className="px-6 mt-6 text-center">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Appuie sur une semaine pour voir le détail
          </p>
        </div>
      )}

    </div>
  );
}