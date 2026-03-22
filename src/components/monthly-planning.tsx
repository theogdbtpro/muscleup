"use client";

import { useMemo, useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { ChevronLeft, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MonthlyPlanningProps = {
  profile: UserProfile;
  onBack: () => void;
  onStartSession: (sessionId?: string) => void;
};

const MONTHS_FULL = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_SHORT = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DAYS_FULL = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const MONTHS_SHORT = ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];

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

  const getSessionName = (sessionId: string) => {
    const found = sessions.find(s => s.id === sessionId);
    if (!found) return null;
    return customNames[found.id] || found.name;
  };

  const displayDate = useMemo(() => {
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const weeks = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const allDays: (Date | null)[] = Array(firstDayOfWeek).fill(null);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      allDays.push(new Date(year, month, i));
    }
    while (allDays.length % 7 !== 0) allDays.push(null);

    const result: (Date | null)[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      result.push(allDays.slice(i, i + 7));
    }
    return result;
  }, [displayDate]);

  const monthStats = useMemo(() => {
    const allDays = weeks.flat().filter(Boolean) as Date[];
    const planned = allDays.filter(d => getSessionForDate(d)).length;
    const done = allDays.filter(d => {
      const ds = d.toISOString().split('T')[0];
      return completedDates.includes(ds) && !!getSessionForDate(d);
    }).length;
    return { planned, done };
  }, [weeks, completedDates]);

  const selectedWeek = selectedWeekIdx !== null ? weeks[selectedWeekIdx] : null;

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col animate-in fade-in duration-300 pb-10">

      {/* Header */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-headline text-white uppercase tracking-wide">
            {MONTHS_FULL[displayDate.getMonth()]}
          </h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{displayDate.getFullYear()}</p>
        </div>
        <div className="flex items-center gap-1">
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

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 flex items-center justify-around">
          <div className="text-center">
            <div className="text-xl font-headline text-white">{monthStats.planned}</div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Prévues</div>
          </div>
          <div className="h-6 w-px bg-[#2A2A2A]" />
          <div className="text-center">
            <div className="text-xl font-headline text-green-400">{monthStats.done}</div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Faites</div>
          </div>
          <div className="h-6 w-px bg-[#2A2A2A]" />
          <div className="text-center">
            <div className="text-xl font-headline text-[#E24B4A]">{Math.max(0, monthStats.planned - monthStats.done)}</div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Restantes</div>
          </div>
        </div>
      </div>

      {/* En-têtes jours */}
      <div className="px-4">
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-zinc-600 uppercase">{d}</div>
          ))}
        </div>

        {/* ── Calendrier : toutes les semaines d'abord ── */}
        <div className="space-y-1">
          {weeks.map((week, wIdx) => {
            const isSelected = selectedWeekIdx === wIdx;

            return (
              <button
                key={wIdx}
                onClick={() => setSelectedWeekIdx(isSelected ? null : wIdx)}
                className={cn(
                  "w-full grid grid-cols-7 rounded-2xl transition-all py-1",
                  isSelected ? "bg-[#1A1A1A] ring-1 ring-[#E24B4A]/40" : "hover:bg-[#1A1A1A]/50",
                )}
              >
                {week.map((date, dIdx) => {
                  if (!date) return <div key={dIdx} className="aspect-square" />;
                  const dateStr = date.toISOString().split('T')[0];
                  const sessionId = getSessionForDate(date);
                  const isDone = completedDates.includes(dateStr) && !!sessionId;
                  const isToday = dateStr === todayStr;
                  const isPast = date < today && !isToday;

                  return (
                    <div key={dateStr} className="flex flex-col items-center justify-center py-1.5 gap-1">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        isToday ? "bg-[#E24B4A] text-white" :
                        isDone ? "bg-green-500/20 text-green-400" :
                        sessionId && !isPast ? "bg-[#E24B4A]/10 text-white" :
                        isPast ? "text-zinc-700" :
                        "text-zinc-500"
                      )}>
                        {date.getDate()}
                      </div>
                      {sessionId ? (
                        <div className={cn("w-1.5 h-1.5 rounded-full",
                          isDone ? "bg-green-400" :
                          isToday ? "bg-white" :
                          isPast ? "bg-zinc-700" :
                          "bg-[#E24B4A]/60"
                        )} />
                      ) : <div className="w-1.5 h-1.5" />}
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>

        {/* ── Détail semaine sélectionnée — APRÈS tout le calendrier ── */}
        {selectedWeek && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl mt-3 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {selectedWeek.map((date, dIdx) => {
              if (!date) return null;
              const dateStr = date.toISOString().split('T')[0];
              const sessionId = getSessionForDate(date);
              const sessionObj = sessionId ? sessions.find(s => s.id === sessionId) : null;
              const isDone = completedDates.includes(dateStr) && !!sessionId;
              const isToday = dateStr === todayStr;
              const isPast = date < today && !isToday;

              return (
                <div key={dateStr} className={cn(
                  "px-4 py-3 border-b border-[#2A2A2A] last:border-0 flex items-center gap-3",
                  isToday ? "bg-[#E24B4A]/5" : "",
                  isDone ? "bg-green-500/5" : "",
                )}>
                  <div className="w-14 shrink-0">
                    <div className={cn("text-[10px] font-bold uppercase", isToday ? "text-[#E24B4A]" : "text-zinc-500")}>
                      {DAYS_SHORT[dIdx]}
                    </div>
                    <div className="text-[9px] text-zinc-700 font-bold">
                      {date.getDate()} {MONTHS_SHORT[date.getMonth()]}
                    </div>
                  </div>

                  {sessionId && sessionObj ? (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm font-bold uppercase tracking-tight",
                          isDone ? "text-green-400" :
                          isToday ? "text-white" :
                          isPast ? "text-zinc-600" :
                          "text-zinc-300"
                        )}>
                          {getSessionName(sessionId)}
                        </div>
                        <div className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5 truncate">
                          {sessionObj.exercises.slice(0,3).map(e => e.muscle).filter((v,i,a) => a.indexOf(v)===i).join(' · ')}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isDone ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-[9px] font-bold text-green-400 uppercase">Validé</span>
                          </div>
                        ) : isToday ? (
                          <button onClick={() => onStartSession(sessionId)}
                            className="bg-[#E24B4A] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase flex items-center gap-1">
                            <Play className="w-3 h-3" /> Go !
                          </button>
                        ) : isPast ? (
                          <span className="text-[10px] font-bold text-zinc-700">—</span>
                        ) : (
                          <span className="text-[9px] font-bold text-zinc-600 uppercase">À venir</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <span className="text-sm font-bold uppercase text-zinc-700">Repos 💤</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Légende */}
        <div className="mt-4 pb-6 flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E24B4A]" />
            <span className="text-[9px] font-bold text-zinc-600 uppercase">Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E24B4A]/40" />
            <span className="text-[9px] font-bold text-zinc-600 uppercase">Séance prévue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-[9px] font-bold text-zinc-600 uppercase">Séance faite</span>
          </div>
        </div>

      </div>
    </div>
  );
}