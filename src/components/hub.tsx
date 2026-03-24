
"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS, Session, Program } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Utensils, 
  ChevronRight, 
  ChevronLeft, 
  Dumbbell, 
  Activity,
  Calendar,
  Lightbulb,
  BarChart,
  Check,
  ChevronUp,
  ChevronDown,
  User as UserIcon,
  ArrowRight,
  Pencil,
  MapPin,
  Sparkles
} from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { getExerciseAdvice } from "@/ai/flows/exercise-advice";
import { Input } from "@/components/ui/input";

const getLocalDateStr = (date: Date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
  onStartSession: (sessionId?: string) => void;
  onReset: () => void;
};

const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function generateBaseSchedule(frequency: string, program: Program): Record<string, string | null> {
  const nbSessions = frequency === "2j" ? 2 : frequency === "3j" ? 3 : frequency === "4j" ? 4 : 5;
  const sessionIds = program.sessions.filter(s => !s.isRestDay).map(s => s.id);
  const result: Record<string, string | null> = {};
  DAY_NAMES.forEach(d => { result[d] = null; });
  const step = DAY_NAMES.length / nbSessions;
  for (let i = 0; i < nbSessions; i++) {
    const dayIdx = Math.min(Math.floor(i * step), DAY_NAMES.length - 1);
    result[DAY_NAMES[dayIdx]] = sessionIds[i % sessionIds.length];
  }
  return result;
}

export default function Hub({ profile, setView, onStartSession, onReset }: HubProps) {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [currentWeekSchedule, setCurrentWeekSchedule] = useState<Record<string, string | null>>({});
  const [dailySchedule, setDailySchedule] = useState<Record<string, string | null>>({});
  const [dailyAdvice, setDailyAdvice] = useState<string>("Prêt pour ta prochaine dose de gains ?");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [draggedDay, setDraggedDay] = useState<string | null>(null);
  
  const user = auth.currentUser;
  const uidPrefix = user ? `_${user.uid}` : "_guest";

  const program = useMemo(() => PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);

  useEffect(() => {
    const loadData = () => {
      const storedDates = localStorage.getItem("completedDates" + uidPrefix);
      if (storedDates) setCompletedDates(JSON.parse(storedDates));

      const storedNames = localStorage.getItem("muscleup_session_names" + uidPrefix);
      if (storedNames) setCustomNames(JSON.parse(storedNames));

      const storedDaily = localStorage.getItem("muscleup_daily_schedule" + uidPrefix);
      if (storedDaily) setDailySchedule(JSON.parse(storedDaily));

      const storedSchedule = localStorage.getItem("muscleup_base_schedule" + uidPrefix) || localStorage.getItem("muscleup_schedule" + uidPrefix);
      if (storedSchedule) {
        setCurrentWeekSchedule(JSON.parse(storedSchedule));
      } else {
        const generated = generateBaseSchedule(profile.frequency, program);
        setCurrentWeekSchedule(generated);
      }
    };
    loadData();
  }, [profile.frequency, profile.objective, uidPrefix, program]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      try {
        const res = await getExerciseAdvice({
          exerciseName: "Musculation",
          level: profile.level,
          objective: profile.objective
        });
        setDailyAdvice(res.advice);
      } catch (e) {
        setDailyAdvice("Garde le focus sur la contraction volontaire pour maximiser l'hypertrophie.");
      } finally {
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [profile.level, profile.objective]);

  const getSessionName = (session: Session) => customNames[session.id] || session.name;

  const finishedToday = useMemo(() => completedDates.includes(getLocalDateStr()), [completedDates]);

  // Fonction pour obtenir la séance d'une date spécifique (gère l'historique vs modèle)
  const getSessionForDate = (date: Date, dayName: string) => {
    const dateStr = getLocalDateStr(date);
    if (dailySchedule[dateStr] !== undefined) return dailySchedule[dateStr];
    
    const templateId = currentWeekSchedule[dayName];
    
    // Si la date est passée ou aujourd'hui, on la "fige" dans le daily schedule
    const today = new Date();
    today.setHours(0,0,0,0);
    const targetDate = new Date(date);
    targetDate.setHours(0,0,0,0);

    if (targetDate <= today) {
      const newDaily = { ...dailySchedule, [dateStr]: templateId };
      setDailySchedule(newDaily);
      localStorage.setItem("muscleup_daily_schedule" + uidPrefix, JSON.stringify(newDaily));
    }
    
    return templateId;
  };

  const currentDayIdx = (new Date().getDay() + 6) % 7;
  const todaySessionId = getSessionForDate(new Date(), DAY_NAMES[currentDayIdx]);
  const todaySession = program.sessions.find(s => s.id === todaySessionId);

  const nextSessionInfo = useMemo(() => {
    if (!finishedToday && todaySession) return null;
    
    for (let i = 1; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dIdx = (d.getDay() + 6) % 7;
      const dName = DAY_NAMES[dIdx];
      const sId = getSessionForDate(d, dName);
      if (sId) {
        const s = program.sessions.find(ps => ps.id === sId);
        if (s) {
          return {
            name: customNames[s.id] || s.name,
            date: `${d.getDate()} ${d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}`
          };
        }
      }
    }
    return null;
  }, [finishedToday, todaySession, dailySchedule, currentWeekSchedule, program, customNames]);

  const weeklyStats = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + (weekOffset * 7));
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    let planned = 0;
    let done = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const ds = getLocalDateStr(d);
      const sId = getSessionForDate(d, DAY_NAMES[i]);
      if (sId) {
        planned++;
        if (completedDates.includes(ds)) done++;
      }
    }
    
    return {
      total: planned,
      done: done,
      percent: planned > 0 ? Math.round((done / planned) * 100) : 0
    };
  }, [currentWeekSchedule, dailySchedule, completedDates, weekOffset]);

  const toggleDateCompletion = (dateStr: string) => {
    const isDone = completedDates.includes(dateStr);
    let newDates;
    if (isDone) {
      newDates = completedDates.filter(d => d !== dateStr);
    } else {
      newDates = [...completedDates, dateStr];
    }
    setCompletedDates(newDates);
    localStorage.setItem("completedDates" + uidPrefix, JSON.stringify(newDates));
    try { navigator.vibrate?.(15); } catch {}
  };

  const moveSession = (day: string, direction: 'up' | 'down') => {
    const index = DAY_NAMES.indexOf(day);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= DAY_NAMES.length) return;

    const targetDay = DAY_NAMES[targetIndex];
    const newSchedule = { ...currentWeekSchedule };
    const tmp = newSchedule[day];
    newSchedule[day] = newSchedule[targetDay];
    newSchedule[targetDay] = tmp;

    setCurrentWeekSchedule(newSchedule);
    localStorage.setItem("muscleup_base_schedule" + uidPrefix, JSON.stringify(newSchedule));
    try { navigator.vibrate?.(20); } catch {}
  };

  const handleTouchStart = (day: string) => {
    setDraggedDay(day);
  };

  const handleTouchEnd = (e: React.TouchEvent, day: string) => {
    const touch = e.changedTouches[0];
    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetRow = targetEl?.closest('[data-day]');
    const targetDay = targetRow?.getAttribute('data-day');
    
    if (targetDay && targetDay !== day) {
      swapDays(day, targetDay);
    }
    setDraggedDay(null);
  };

  const swapDays = (day1: string, day2: string) => {
    const newSchedule = { ...currentWeekSchedule };
    const tmp = newSchedule[day1];
    newSchedule[day1] = newSchedule[day2];
    newSchedule[day2] = tmp;

    setCurrentWeekSchedule(newSchedule);
    localStorage.setItem("muscleup_base_schedule" + uidPrefix, JSON.stringify(newSchedule));
    try { navigator.vibrate?.(30); } catch {}
  };

  const handleRename = (id: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const newNames = { ...customNames, [id]: trimmed };
    setCustomNames(newNames);
    localStorage.setItem("muscleup_session_names" + uidPrefix, JSON.stringify(newNames));
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-28">
      {/* 1. Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <UserIcon className="w-6 h-6 text-zinc-600" />
          </div>
          <div>
            <h1 className="text-3xl font-headline text-white leading-none tracking-tight">
              {profile.name ? `SALUT ${profile.name.toUpperCase()} !` : "SALUT !"}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border border-blue-500/30">
                {profile.location === 'maison' ? "🏠 MAISON" : "🏋️ SALLE"}
              </span>
              <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">• {profile.level}</span>
            </div>
          </div>
        </div>
        <div className="bg-[#E24B4A] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#E24B4A]/30 press-effect">
          <Flame className="w-4 h-4 text-white fill-white animate-pulse" />
          <span className="text-sm font-black text-white tracking-tighter uppercase">{completedDates.length} JOURS</span>
        </div>
      </header>

      {/* 2. Navigation Grid - Flashy */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setView("body-profile")} className="bg-zinc-900 border border-zinc-800 py-4 rounded-[22px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group relative overflow-hidden">
          <BarChart className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Profil</span>
        </button>
        <button onClick={() => setView("nutrition")} className="bg-zinc-900 border border-zinc-800 py-4 rounded-[22px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group relative overflow-hidden">
          <Utensils className="w-6 h-6 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Nutrition</span>
        </button>
        <button onClick={() => setView("planning-mensuel")} className="bg-zinc-900 border border-zinc-800 py-4 rounded-[22px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group relative overflow-hidden">
          <Calendar className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest text-center leading-tight">Planning<br/>Mensuel</span>
        </button>
      </div>

      {/* 3. Carte Héros */}
      {finishedToday && weekOffset === 0 ? (
        <Card className="bg-gradient-to-br from-[#0B1A10] to-[#08120C] border border-green-900/40 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group animate-in zoom-in duration-500 shadow-green-950/40">
          <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-start">
            <span className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest block mb-1">SÉANCE TERMINÉE ✓</span>
            <h2 className="text-6xl font-headline text-white uppercase leading-none mb-8 tracking-tighter">
              {todaySession ? getSessionName(todaySession) : "RÉCUPÉRATION"}
            </h2>
            {nextSessionInfo && (
              <div className="bg-black/60 backdrop-blur-md p-5 rounded-3xl border border-white/10 inline-flex flex-col min-w-[170px] slide-up stagger-1 shadow-2xl">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  SUIVANT <ArrowRight className="w-2.5 h-2.5" />
                </span>
                <span className="text-xl font-headline text-[#4ADE80] leading-none uppercase tracking-tight">{nextSessionInfo.name}</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase mt-1.5">{nextSessionInfo.date}</span>
              </div>
            )}
          </div>
          <Check className="absolute -right-6 -bottom-6 w-48 h-48 text-green-500/10 -rotate-12 pointer-events-none" />
        </Card>
      ) : (!todaySession && weekOffset === 0) ? (
        <Card className="bg-gradient-to-br from-[#0B1A10] to-[#08120C] border border-green-900/40 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest block mb-2">JOUR DE REPOS</span>
            <h2 className="text-5xl font-headline text-white uppercase leading-none mb-3">RECUPERATION</h2>
          </div>
          <Activity className="absolute -right-4 -bottom-4 w-40 h-40 text-green-500/5 -rotate-12" />
        </Card>
      ) : weekOffset === 0 ? (
        <Card className="bg-gradient-to-br from-[#E24B4A]/20 to-[#E24B4A]/5 border border-[#E24B4A]/20 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-[#E24B4A] uppercase tracking-widest block mb-2">SÉANCE DU JOUR</span>
            <h2 className="text-5xl font-headline text-white uppercase leading-none mb-6">{todaySession ? getSessionName(todaySession) : ""}</h2>
            <Button onClick={() => onStartSession(todaySession?.id)} className="bg-[#E24B4A] text-white font-headline text-2xl h-16 px-10 rounded-2xl shadow-2xl shadow-[#E24B4A]/30 press-effect ripple">
              C'EST PARTI !
            </Button>
          </div>
          <Dumbbell className="absolute -right-6 -bottom-6 w-48 h-48 text-[#E24B4A]/10 rotate-12" />
        </Card>
      ) : (
        <div className="h-4" />
      )}

      {/* 4. Planning Hebdomadaire */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-headline text-white tracking-wide uppercase">Planning</h2>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setWeekOffset(prev => prev - 1)} 
               className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all press-effect"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setWeekOffset(0)} 
               className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2"
             >
               {weekOffset === 0 ? "CETTE SEM." : (weekOffset > 0 ? `+${weekOffset} SEM.` : `${weekOffset} SEM.`)}
             </button>
             <button 
               onClick={() => setWeekOffset(prev => prev + 1)} 
               className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all press-effect"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div className="bg-[#141414] border border-zinc-800/50 rounded-[32px] overflow-hidden shadow-2xl">
          {DAY_NAMES.map((day, idx) => {
            const date = new Date();
            const currentDayReal = (date.getDay() + 6) % 7;
            const diff = idx - currentDayReal + (weekOffset * 7);
            date.setDate(date.getDate() + diff);
            const dateStr = getLocalDateStr(date);

            const sessionId = getSessionForDate(date, day);
            const session = program.sessions.find(s => s.id === sessionId);
            
            const isToday = weekOffset === 0 && currentDayReal === idx;
            const isDone = completedDates.includes(dateStr);
            const isPast = date < new Date(new Date().setHours(0,0,0,0));

            return (
              <div 
                key={day} 
                data-day={day}
                draggable={!isPast && !!session}
                onDragStart={() => handleTouchStart(day)}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={() => swapDays(draggedDay!, day)}
                onTouchStart={() => !isPast && !!session && handleTouchStart(day)}
                onTouchEnd={(e) => !isPast && !!session && handleTouchEnd(e, day)}
                className={cn(
                  "p-5 flex items-center justify-between border-b border-zinc-800 last:border-0 transition-all", 
                  isDone ? "bg-green-500/10" : (isToday ? "bg-[#E24B4A]/5" : ""),
                  draggedDay === day && "opacity-40 scale-95"
                )}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-14 shrink-0">
                    <span className={cn("text-[11px] font-black uppercase block leading-none mb-1", isToday ? "text-[#E24B4A]" : "text-zinc-600")}>
                      {day}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                      {date.getDate()} {date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    {editingId === session?.id ? (
                      <Input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(session!.id)}
                        onBlur={() => setEditingId(null)}
                        className="h-8 bg-black border-primary text-white font-headline text-lg uppercase"
                      />
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span className={cn("text-2xl font-headline uppercase truncate tracking-tight block", 
                          session ? (isDone ? "text-green-400" : (isPast ? "text-zinc-700" : "text-white")) : "text-zinc-800"
                        )}>
                          {session ? getSessionName(session) : "REPOS"}
                        </span>
                        {session && !isPast && (
                          <button 
                            onClick={() => { setEditingId(session.id); setEditValue(getSessionName(session)); }}
                            className="p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 text-zinc-600 hover:text-primary transition-all"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 ml-3">
                  {session && !isPast && (
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSession(day, 'up'); }}
                        disabled={idx === 0}
                        className="p-1 bg-zinc-800/50 text-zinc-500 hover:text-white rounded disabled:opacity-0 transition-all press-effect"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSession(day, 'down'); }}
                        disabled={idx === 6}
                        className="p-1 bg-zinc-800/50 text-zinc-500 hover:text-white rounded disabled:opacity-0 transition-all press-effect"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={() => toggleDateCompletion(dateStr)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all press-effect", 
                      isDone ? "bg-green-500 border-green-500" : "border-zinc-800"
                    )}
                  >
                    {isDone && <Check className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Programme Actuel */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-4 rounded-3xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl shadow-lg">
            {program.emoji}
          </div>
          <div>
            <h3 className="text-sm font-headline text-white uppercase tracking-tight">{program.name}</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {profile.frequency}/sem • {program.sessions.length} séances
            </p>
          </div>
        </div>
        <button 
          onClick={() => setView("settings")}
          className="h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-[#E24B4A] text-white shadow-lg shadow-[#E24B4A]/20 active:scale-95 transition-all"
        >
          MODIFIER {'>'}
        </button>
      </Card>

      {/* 6. Objectif Semaine */}
      <section className="space-y-4">
        <h2 className="text-2xl font-headline text-white tracking-wide uppercase">Objectif Semaine</h2>
        <Card className={cn(
          "transition-all duration-500 border p-6 rounded-[32px] space-y-4 shadow-2xl",
          weeklyStats.percent === 100 
            ? "bg-green-600/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]" 
            : "bg-zinc-900/30 border-zinc-800/50"
        )}>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-5xl font-headline text-white leading-none">{weeklyStats.done} / {weeklyStats.total}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">SÉANCES VALIDÉES</div>
            </div>
            <div className={cn("text-2xl font-headline", weeklyStats.percent === 100 ? "text-green-400" : "text-[#E24B4A]")}>
              {weeklyStats.percent}%
            </div>
          </div>
          <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                weeklyStats.percent === 100 ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-[#E24B4A] shadow-[0_0_10px_rgba(226,75,74,0.3)]"
              )}
              style={{ width: `${weeklyStats.percent}%` }}
            />
          </div>
        </Card>
      </section>

      {/* 7. Conseil du Jour */}
      <section className="space-y-4">
        <h2 className="text-2xl font-headline text-white tracking-wide uppercase">Le Coach dit...</h2>
        <Card className="bg-[#1A1A1A]/40 border border-zinc-800/50 p-6 rounded-[32px] flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
          </div>
          <p className={cn("text-sm text-zinc-400 italic font-medium leading-relaxed", loadingAdvice && "animate-pulse")}>
            "{dailyAdvice}"
          </p>
        </Card>
      </section>
    </div>
  );
}
