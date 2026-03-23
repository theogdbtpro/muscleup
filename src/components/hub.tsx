
"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS, Session, Program } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Flame, 
  Utensils, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Dumbbell, 
  Activity,
  Calendar,
  Lightbulb,
  BarChart,
  Pencil,
  Check,
  GripVertical,
  User as UserIcon
} from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { getExerciseAdvice } from "@/ai/flows/exercise-advice";

const getLocalDateStr = (date: Date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
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
  const [dailyAdvice, setDailyAdvice] = useState<string>("Charge tes batteries pour ta prochaine séance !");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [draggedDay, setDraggedDay] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);

  const program = useMemo(() => PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);
  const user = auth.currentUser;
  const uidPrefix = user ? `_${user.uid}` : "_guest";

  useEffect(() => {
    const loadData = () => {
      const storedDates = localStorage.getItem("completedDates" + uidPrefix);
      if (storedDates) setCompletedDates(JSON.parse(storedDates));

      const storedNames = localStorage.getItem("muscleup_session_names" + uidPrefix);
      if (storedNames) setCustomNames(JSON.parse(storedNames));

      const storedSchedule = localStorage.getItem("muscleup_base_schedule" + uidPrefix) || localStorage.getItem("muscleup_schedule" + uidPrefix);
      if (storedSchedule) {
        setCurrentWeekSchedule(JSON.parse(storedSchedule));
      } else {
        const generated = generateBaseSchedule(profile.frequency, program);
        setCurrentWeekSchedule(generated);
      }
    };
    loadData();
  }, [profile.frequency, program, uidPrefix]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      try {
        const res = await getExerciseAdvice({
          exerciseName: "Musculation générale",
          level: profile.level,
          objective: profile.objective
        });
        setDailyAdvice(res.advice);
      } catch (e) {
        setDailyAdvice("Garde les omoplates serrées sur le banc pour protéger tes épaules.");
      } finally {
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [profile.level, profile.objective]);

  const getSessionName = (session: Session) => customNames[session.id] || session.name;

  const finishedToday = useMemo(() => completedDates.includes(getLocalDateStr()), [completedDates]);

  const weeklyStats = useMemo(() => {
    const totalPlanned = Object.values(currentWeekSchedule).filter(id => id !== null).length;
    const now = new Date();
    now.setDate(now.getDate() + (weekOffset * 7));
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    let doneThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const ds = getLocalDateStr(d);
      if (completedDates.includes(ds) && currentWeekSchedule[DAY_NAMES[i]]) {
        doneThisWeek++;
      }
    }
    
    return {
      total: totalPlanned,
      done: doneThisWeek,
      percent: totalPlanned > 0 ? Math.round((doneThisWeek / totalPlanned) * 100) : 0
    };
  }, [currentWeekSchedule, completedDates, weekOffset]);

  const handleSaveName = (id: string) => {
    const newNames = { ...customNames, [id]: editValue };
    setCustomNames(newNames);
    localStorage.setItem("muscleup_session_names" + uidPrefix, JSON.stringify(newNames));
    setEditingSessionId(null);
  };

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

  const onDragStart = (day: string) => {
    setDraggedDay(day);
    try { navigator.vibrate?.(10); } catch {}
  };

  const onDragOver = (e: React.DragEvent, day: string) => {
    e.preventDefault();
    if (day !== dragOverDay) setDragOverDay(day);
  };

  const onDrop = (targetDay: string) => {
    if (!draggedDay || draggedDay === targetDay) {
      setDraggedDay(null);
      setDragOverDay(null);
      return;
    }

    const newSchedule = { ...currentWeekSchedule };
    const tmp = newSchedule[draggedDay];
    newSchedule[draggedDay] = newSchedule[targetDay];
    newSchedule[targetDay] = tmp;

    setCurrentWeekSchedule(newSchedule);
    localStorage.setItem("muscleup_base_schedule" + uidPrefix, JSON.stringify(newSchedule));
    localStorage.setItem("muscleup_schedule" + uidPrefix, JSON.stringify(newSchedule));
    
    setDraggedDay(null);
    setDragOverDay(null);
    try { navigator.vibrate?.(20); } catch {}
  };

  const bodyProfileStats = useMemo(() => {
    if (!profile.bodyProfile) return null;
    const { poids, taille } = profile.bodyProfile;
    const imc = poids / ((taille / 100) ** 2);
    let color = "text-green-500";
    if (imc < 18.5 || imc >= 25) color = "text-yellow-500";
    if (imc >= 30) color = "text-red-500";
    return { summary: `${poids}KG · ${taille}CM · IMC ${imc.toFixed(1)}`, color };
  }, [profile.bodyProfile]);

  const currentDayIdx = (new Date().getDay() + 6) % 7;
  const todaySessionId = currentWeekSchedule[DAY_NAMES[currentDayIdx]];
  const todaySession = program.sessions.find(s => s.id === todaySessionId);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-28">
      {/* 1. Header avec Avatar */}
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
        <div className="bg-primary px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 press-effect">
          <Flame className="w-4 h-4 text-white fill-white animate-pulse" />
          <span className="text-sm font-black text-white tracking-tighter uppercase">{completedDates.length} JOURS</span>
        </div>
      </header>

      {/* 2. Carte Programme Actuel (Glassmorphism) */}
      <Card className="bg-[#1A1A1A]/60 backdrop-blur-md border-[#2A2A2A] p-4 rounded-3xl flex items-center justify-between shadow-xl">
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
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setView("settings")}
          className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter bg-primary shadow-lg shadow-primary/20 press-effect"
        >
          RÉGLER {'>'}
        </Button>
      </Card>

      {/* 3. Carte Héros (Glow Effect) */}
      {(!todaySession || finishedToday) && weekOffset === 0 ? (
        <Card className="bg-gradient-to-br from-[#163020] to-[#0F1F15] border border-green-900/30 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <span className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest block mb-2 flex items-center gap-2">
              RÉCUPÉRATION <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            </span>
            <h2 className="text-5xl font-headline text-white uppercase leading-none mb-3">JOUR DE REPOS</h2>
            <p className="text-sm text-[#4ADE80]/80 font-medium">Tes muscles se construisent maintenant. Repose-toi !</p>
          </div>
          <Activity className="absolute -right-4 -bottom-4 w-40 h-40 text-green-500/5 -rotate-12 transition-transform group-hover:scale-110 duration-500" />
        </Card>
      ) : weekOffset === 0 ? (
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2 flex items-center gap-2">
              SÉANCE DU JOUR <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </span>
            <h2 className="text-5xl font-headline text-white uppercase leading-none mb-6">{todaySession ? getSessionName(todaySession) : ""}</h2>
            <Button onClick={() => onStartSession(todaySession?.id)} className="bg-primary text-white font-headline text-2xl h-16 px-10 rounded-2xl shadow-2xl shadow-primary/30 press-effect ripple">
              C'EST PARTI !
            </Button>
          </div>
          <Dumbbell className="absolute -right-6 -bottom-6 w-48 h-48 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </Card>
      ) : null}

      {/* 4. Planning Hebdomadaire (Modern List) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-headline text-white tracking-wide uppercase">Planning</h2>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              {weekOffset === 0 ? "Cette semaine" : weekOffset > 0 ? `Dans ${weekOffset} sem.` : `Il y a ${Math.abs(weekOffset)} sem.`}
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              {weeklyStats.done}/{weeklyStats.total} complété
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
             <button onClick={() => setWeekOffset(prev => prev - 1)} className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all press-effect">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={() => setWeekOffset(0)} className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter px-3 py-2 hover:text-primary transition-colors">AUJOURD'HUI</button>
             <button onClick={() => setWeekOffset(prev => prev + 1)} className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all press-effect">
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div className="bg-[#141414] border border-zinc-800/50 rounded-[32px] overflow-hidden shadow-2xl">
          {DAY_NAMES.map((day, idx) => {
            const sessionId = currentWeekSchedule[day];
            const session = program.sessions.find(s => s.id === sessionId);
            
            const date = new Date();
            const currentDayReal = (date.getDay() + 6) % 7;
            const diff = idx - currentDayReal + (weekOffset * 7);
            date.setDate(date.getDate() + diff);
            const dateStr = getLocalDateStr(date);
            const displayDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            
            const isToday = weekOffset === 0 && currentDayReal === idx;
            const isDone = completedDates.includes(dateStr);
            const isPast = date < new Date(new Date().setHours(0,0,0,0));
            
            const isDragged = draggedDay === day;
            const isOver = dragOverDay === day;

            return (
              <div 
                key={day} 
                draggable={!!session && !isPast}
                onDragStart={() => !isPast && onDragStart(day)}
                onDragOver={(e) => !isPast && onDragOver(e, day)}
                onDrop={() => !isPast && onDrop(day)}
                className={cn(
                  "p-5 flex items-center justify-between border-b border-zinc-800/30 last:border-0 transition-all", 
                  isToday ? "bg-primary/5" : "",
                  isDragged ? "opacity-30 scale-95" : "opacity-100",
                  isOver ? "bg-primary/10" : "",
                  !isPast && session ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                )}
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-12 shrink-0 text-center">
                    <span className={cn("text-[11px] font-black uppercase block leading-none mb-1", isToday ? "text-primary" : isPast ? "text-zinc-700" : "text-zinc-600")}>{day.substring(0,3)}</span>
                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{displayDate}</span>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    {session && !isPast && <GripVertical className="w-4 h-4 text-zinc-800 shrink-0" />}
                    
                    {editingSessionId === session?.id ? (
                      <div className="flex items-center gap-2 flex-1 animate-in slide-in-from-left-2">
                        <Input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName(session!.id)}
                          onBlur={() => setEditingSessionId(null)}
                          className="h-8 bg-zinc-900 border-primary/50 text-xs rounded-lg"
                        />
                        <button onClick={() => handleSaveName(session!.id)} className="p-1.5 bg-green-500/10 text-green-500 rounded-lg"><Check className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-headline uppercase truncate tracking-tight", 
                            session ? (isPast ? "text-zinc-600" : "text-white") : "text-zinc-800"
                          )}>
                            {session ? getSessionName(session) : "RÉCUPÉRATION"}
                          </span>
                          {session && !isPast && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditValue(getSessionName(session)); }}
                              className="p-1 text-zinc-800 hover:text-primary transition-colors shrink-0"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {session && !isPast && <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{session.duration} • {session.exercises.length} exercices</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  <button 
                    onClick={() => toggleDateCompletion(dateStr)}
                    className={cn(
                      "w-7 h-7 rounded-2xl border-2 flex items-center justify-center transition-all press-effect", 
                      isDone ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/20" : "border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-center font-bold text-zinc-700 uppercase tracking-widest animate-pulse">
          💡 ASTUCE : Glisse une séance pour la déplacer
        </p>
      </section>

      {/* 5. Grille de navigation (Accents Couleurs) */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setView("progres")} className="bg-[#1A1A1A] border border-zinc-800/50 p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-zinc-800/50 group">
          <div className="w-12 h-12 rounded-2xl bg-[#EE3BAA]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-[#EE3BAA]" />
          </div>
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Progrès</span>
        </button>
        <button onClick={() => setView("nutrition")} className="bg-[#1A1A1A] border border-zinc-800/50 p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-zinc-800/50 group">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Utensils className="w-6 h-6 text-primary" />
          </div>
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Nutrition</span>
        </button>
        <button onClick={() => setView("planning-mensuel")} className="bg-[#1A1A1A] border border-zinc-800/50 p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-zinc-800/50 group">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Planning</span>
        </button>
      </div>

      {/* 6. Profil Corporel Card (Large) */}
      <button onClick={() => setView("body-profile")} className="w-full bg-gradient-to-r from-[#1A1A1A] to-zinc-900 border border-zinc-800/50 p-6 rounded-[32px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-lg">
            <BarChart className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <span className="text-sm font-headline text-white uppercase block leading-tight tracking-tight">Profil corporel 📊</span>
            <span className={cn("text-[10px] font-black uppercase tracking-tight", bodyProfileStats?.color || "text-zinc-600")}>
              {bodyProfileStats?.summary || "Complète tes mesures"}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      {/* 7. Conseil du Jour (Modernized) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-headline text-white tracking-wide uppercase">Le Coach dit...</h2>
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-md border border-zinc-800/50 p-8 rounded-[32px] flex items-start gap-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-lg">
            <Lightbulb className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>
          <p className={cn("text-sm text-zinc-300 italic font-medium leading-relaxed", loadingAdvice && "animate-pulse")}>
            "{dailyAdvice}"
          </p>
        </Card>
      </section>

      {/* 8. Ma Progression (Progress Card) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-headline text-white tracking-wide uppercase">Effort Semainier</h2>
        <Card className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-[40px] shadow-2xl space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-6xl font-headline text-white leading-none">{weeklyStats.done} / {weeklyStats.total}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                SÉANCES VALIDÉES <div className="w-1 h-1 rounded-full bg-primary" /> OBJECTIF : {profile.frequency}
              </div>
            </div>
            <div className="text-3xl font-headline text-primary">{weeklyStats.percent}%</div>
          </div>
          <div className="h-4 bg-zinc-800/50 rounded-full overflow-hidden p-1">
            <div 
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(226,75,74,0.4)]" 
              style={{ width: `${weeklyStats.percent}%` }}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
