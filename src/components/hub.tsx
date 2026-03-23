
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
  GripVertical
} from "lucide-react";
import { useMemo, useEffect, useState, useRef } from "react";
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
  
  // État pour l'édition du nom
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // État pour le Drag & Drop
  const [draggedDay, setDraggedDay] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);

  const program = useMemo(() => PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);
  const user = auth.currentUser;
  const uidPrefix = user ? `_${user.uid}` : "_guest";

  useEffect(() => {
    const loadData = () => {
      // On charge les dates complétées
      const storedDates = localStorage.getItem("completedDates" + uidPrefix);
      if (storedDates) setCompletedDates(JSON.parse(storedDates));

      // On charge les noms personnalisés
      const storedNames = localStorage.getItem("muscleup_session_names" + uidPrefix);
      if (storedNames) setCustomNames(JSON.parse(storedNames));

      // On charge le planning (priorité au planning de base des réglages)
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
    // Ajustement pour la semaine affichée
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

  // Logique de Drag & Drop
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
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* 1. Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-headline text-white leading-none">
            {profile.name ? `BONJOUR ${profile.name.toUpperCase()} !` : "BONJOUR !"}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="bg-[#1D4ED8] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              {profile.location === 'maison' ? "🏠 MODE MAISON" : "🏋️ MODE SALLE"}
            </span>
          </div>
        </div>
        <div className="bg-primary px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20">
          <Flame className="w-4 h-4 text-white fill-white" />
          <span className="text-sm font-bold text-white tracking-tighter uppercase">{completedDates.length} JOURS</span>
        </div>
      </header>

      {/* 2. Carte Programme Actuel */}
      <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl">
            {program.emoji}
          </div>
          <div>
            <h3 className="text-sm font-headline text-white uppercase tracking-tight">{program.name}</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {profile.level} · {profile.frequency}/sem
            </p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => setView("settings")}
          className="h-8 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-primary"
        >
          MODIFIER {'>'}
        </Button>
      </Card>

      {/* 3. Carte Héros */}
      {(!todaySession || finishedToday) && weekOffset === 0 ? (
        <Card className="bg-[#163020] border-none p-6 rounded-3xl">
          <span className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest block mb-2 flex items-center gap-1">
            JOUR DE REPOS <span className="text-base">🌊</span>
          </span>
          <h2 className="text-4xl font-headline text-white uppercase leading-none mb-2">RÉCUPÉRATION</h2>
          <p className="text-sm text-[#4ADE80]/80 font-medium">Profite pour bien récupérer et t'hydrater.</p>
        </Card>
      ) : weekOffset === 0 ? (
        <Card className="bg-primary/10 border-primary/20 p-6 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2 flex items-center gap-1">
              PROCHAINE SÉANCE <span className="text-base">🔥</span>
            </span>
            <h2 className="text-4xl font-headline text-white uppercase leading-none mb-4">{todaySession ? getSessionName(todaySession) : ""}</h2>
            <Button onClick={() => onStartSession(todaySession?.id)} className="bg-primary text-white font-headline text-xl h-12 px-8 rounded-xl">
              C'EST PARTI !
            </Button>
          </div>
          <Dumbbell className="absolute -right-4 -bottom-4 w-32 h-32 text-primary/10 rotate-12" />
        </Card>
      ) : null}

      {/* 4. Section Planning */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-headline text-white tracking-wide uppercase">Planning</h2>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
              {weekOffset === 0 ? "Cette semaine" : weekOffset > 0 ? `Dans ${weekOffset} sem.` : `Il y a ${Math.abs(weekOffset)} sem.`}
            </span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setWeekOffset(prev => prev - 1)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
               <ChevronLeft className="w-4 h-4" />
             </button>
             <button onClick={() => setWeekOffset(0)} className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter px-2">AUJOURD'HUI</button>
             <button onClick={() => setWeekOffset(prev => prev + 1)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl overflow-hidden">
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
                  "p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0 transition-all", 
                  isToday ? "bg-primary/5" : "",
                  isDragged ? "opacity-30 scale-95" : "opacity-100",
                  isOver ? "bg-primary/20 border-y-primary/50" : "",
                  !isPast && session ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 shrink-0">
                    <span className={cn("text-[10px] font-black uppercase block", isToday ? "text-primary" : isPast ? "text-zinc-700" : "text-zinc-600")}>{day}</span>
                    <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{displayDate}</span>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {session && !isPast && <GripVertical className="w-3.5 h-3.5 text-zinc-800 shrink-0" />}
                    
                    {editingSessionId === session?.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <Input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveName(session!.id)}
                          onBlur={() => setEditingSessionId(null)}
                          className="h-7 bg-[#0F0F0F] border-primary text-xs"
                        />
                        <button onClick={() => handleSaveName(session!.id)} className="p-1 text-green-500"><Check className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <>
                        <span className={cn("text-sm font-bold uppercase truncate", 
                          session ? (isPast ? "text-zinc-600" : "text-white") : "text-zinc-800"
                        )}>
                          {session ? getSessionName(session) : "REPOS"}
                        </span>
                        {session && !isPast && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditValue(getSessionName(session)); }}
                            className="p-1 text-zinc-700 hover:text-primary transition-colors shrink-0"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <button 
                    onClick={() => toggleDateCompletion(dateStr)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all press-effect", 
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
        <p className="text-[9px] text-center font-bold text-zinc-700 uppercase tracking-widest">
          💡 Glisse une séance pour la déplacer (futur uniquement)
        </p>
      </section>

      {/* 5. Grille de navigation */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setView("progres")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all">
          <Activity className="w-6 h-6 text-[#EE3BAA]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
        </button>
        <button onClick={() => setView("nutrition")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all">
          <Utensils className="w-6 h-6 text-primary" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
        </button>
        <button onClick={() => setView("planning-mensuel")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all">
          <Calendar className="w-6 h-6 text-purple-400" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Planning</span>
        </button>
      </div>

      {/* 6. Profil Corporel Card */}
      <button onClick={() => setView("body-profile")} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BarChart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-[12px] font-bold text-white uppercase block leading-tight">Mon profil corporel 📊</span>
            <span className={cn("text-[10px] font-bold uppercase tracking-tight", bodyProfileStats?.color || "text-zinc-500")}>
              {bodyProfileStats?.summary || "Complète tes mesures"}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
      </button>

      {/* 7. Conseil du Jour */}
      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide uppercase">Conseil du jour</h2>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-3xl flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-amber-500" />
          </div>
          <p className={cn("text-sm text-zinc-300 italic leading-relaxed", loadingAdvice && "animate-pulse")}>
            "{dailyAdvice}"
          </p>
        </Card>
      </section>

      {/* 8. Ma Progression */}
      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide uppercase">Ma progression</h2>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-8 rounded-3xl space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-5xl font-headline text-white">{weeklyStats.done} / {weeklyStats.total}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Séances cette semaine</div>
            </div>
            <div className="text-2xl font-headline text-primary">{weeklyStats.percent}%</div>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${weeklyStats.percent}%` }}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
