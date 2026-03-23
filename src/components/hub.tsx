
"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS, Session, Exercise, Program } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Activity, Utensils, Lightbulb, CheckCircle2, Circle, ChevronRight, ChevronLeft, Clock, Timer, Zap, Info, Dumbbell, Home as HomeIcon, BarChart, Pencil, Check, X, RotateCcw, GripVertical, CalendarDays, LogOut } from "lucide-react";
import { useMemo, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

const getLocalDateStr = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
};

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
  onStartSession: (sessionId?: string) => void;
  onReset: () => void;
};

const OBJECTIVE_TIPS: Record<string, string> = {
  "gros-bras": "Focus sur la contraction volontaire, ne balance pas les charges !",
  "pectoraux": "Garde les omoplates serrées sur le banc pour protéger tes épaules.",
  "dos-large": "Imagine que tu tires avec tes coudes, pas avec tes mains.",
  "full-body": "Priorise les mouvements polyarticulaires pour brûler plus de calories.",
  "jambes": "Descends au moins jusqu'à la parallèle pour engager les fessiers.",
  "abdos": "La sangle abdominale se forge aussi dans l'assiette, reste hydraté."
};

const MONTHS = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"];
const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

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

function EditableSessionName({
  sessionId, defaultName, currentName, onSave, onReset, className = "", onEditingChange,
}: {
  sessionId: string; defaultName: string; currentName: string;
  onSave: (id: string, name: string) => void;
  onReset: (id: string) => void;
  className?: string;
  onEditingChange?: (editing: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const startEditing = () => { setIsEditing(true); onEditingChange?.(true); };
  const stopEditing = () => { setIsEditing(false); onEditingChange?.(false); };
  const [value, setValue] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustomized = currentName !== defaultName;

  useEffect(() => {
    if (isEditing) {
      setValue(currentName);
      setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 50);
    }
  }, [isEditing, currentName]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed) onSave(sessionId, trimmed);
    stopEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") stopEditing();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
        <input ref={inputRef} value={value} onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown} maxLength={40}
          className={`bg-transparent border-b border-white/40 focus:border-white outline-none font-bold text-white flex-1 min-w-0 ${className}`} />
        <button onClick={handleSave} className="text-green-400 hover:text-green-300 shrink-0"><Check size={15} /></button>
        <button onClick={stopEditing} className="text-red-400 hover:text-red-300 shrink-0"><X size={15} /></button>
        {isCustomized && (
          <button onClick={() => { onReset(sessionId); stopEditing(); }}
            className="text-zinc-500 hover:text-zinc-300 shrink-0" title="Remettre le nom d'origine">
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group/name flex-1 min-w-0">
      <span className={`font-bold truncate ${className}`}>{currentName}</span>
      <button onClick={e => { e.stopPropagation(); startEditing(); }}
        className="opacity-30 hover:opacity-100 text-white transition-opacity shrink-0"
        title="Renommer la séance">
        <Pencil size={12} />
      </button>
    </div>
  );
}

export default function Hub({ profile, setView, onStartSession, onReset }: HubProps) {
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [isSessionPickerOpen, setIsSessionPickerOpen] = useState(false);
  const [selectedPreviewSession, setSelectedPreviewSession] = useState<{session: Session, day: string, date: Date} | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [manualSchedule, setManualSchedule] = useState<Record<string, string | null> | null>(null);
  const [currentWeekSchedule, setCurrentWeekSchedule] = useState<Record<string, string | null>>({});
  const program = useMemo(() => PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);

  useEffect(() => { setIsMounted(true); }, []);

  const loadData = () => {
    const user = auth.currentUser;
    if (!user) return;

    const prefix = `_${user.uid}`;
    const savedHistory = localStorage.getItem("muscleup_history" + prefix);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedDates = localStorage.getItem("completedDates" + prefix);
    if (savedDates) setCompletedDates(JSON.parse(savedDates));
    
    const savedNames = localStorage.getItem("muscleup_session_names" + prefix);
    if (savedNames) setCustomNames(JSON.parse(savedNames));
    
    const savedManual = localStorage.getItem("muscleup_manual_schedule" + prefix);
    if (savedManual) setManualSchedule(JSON.parse(savedManual));
    
    const savedSchedule = localStorage.getItem("muscleup_schedule" + prefix) || localStorage.getItem("muscleup_base_schedule" + prefix);
    if (savedSchedule) {
      setCurrentWeekSchedule(JSON.parse(savedSchedule));
    } else {
      const generated = generateBaseSchedule(profile.frequency, program);
      setCurrentWeekSchedule(generated);
      localStorage.setItem("muscleup_schedule" + prefix, JSON.stringify(generated));
    }
  };

  useEffect(() => {
    loadData();
  }, [profile.frequency, program]);

  const saveCustomName = (sessionId: string, name: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const updated = { ...customNames, [sessionId]: name };
    setCustomNames(updated);
    localStorage.setItem("muscleup_session_names" + `_${user.uid}`, JSON.stringify(updated));
    toast({ title: "Nom mis à jour ✓" });
  };

  const resetCustomName = (sessionId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const updated = { ...customNames };
    delete updated[sessionId];
    setCustomNames(updated);
    localStorage.setItem("muscleup_session_names" + `_${user.uid}`, JSON.stringify(updated));
  };

  const getSessionName = (session: Session) => customNames[session.id] || session.name;

  const streak = useMemo(() => {
    const dates = Array.from(new Set(completedDates)).sort().reverse();
    if (dates.length === 0) return 0;
    const today = getLocalDateStr();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = getLocalDateStr();
    
    if (dates[0] !== today && dates[0] !== yesterdayStr) return 0;
    let count = 0;
    let checkDate = dates[0] === today ? new Date() : yesterdayDate;
    
    while (true) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth()+1).padStart(2,'0')}-${String(checkDate.getDate()).padStart(2,'0')}`;
      if (dates.includes(checkStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [completedDates]);

  const schedule = useMemo(() => {
    if (weekOffset === 0) return manualSchedule ?? currentWeekSchedule;
    return generateBaseSchedule(profile.frequency, program);
  }, [weekOffset, manualSchedule, currentWeekSchedule, program]);

  const now = new Date();
  const currentDayIdx = (now.getDay() + 6) % 7;
  const todayName = DAY_NAMES[currentDayIdx];
  const finishedToday = useMemo(() => {
    const todayStr = getLocalDateStr();
    return completedDates.includes(todayStr);
  }, [completedDates]);

  const todaySessionId = (manualSchedule ?? currentWeekSchedule)[todayName] ?? null;
  const todaySession = program.sessions.find(s => s.id === todaySessionId);
  const todaySessionDisplayName = todaySession ? getSessionName(todaySession) : 'Repos aujourd\'hui';
  const todayIsRest = !todaySession || todaySession.isRestDay;

  const weekDates = useMemo(() => {
    const monday = new Date();
    monday.setDate(monday.getDate() - currentDayIdx + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);
    return DAY_NAMES.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset, currentDayIdx]);

  const bodyProfileStats = useMemo(() => {
    if (!profile.bodyProfile) return null;
    const { poids, taille } = profile.bodyProfile;
    const imc = poids / ((taille / 100) ** 2);
    let color = "text-zinc-500";
    if (imc < 18.5) color = "text-yellow-500";
    else if (imc < 25) color = "text-green-500";
    else if (imc < 30) color = "text-yellow-500";
    else color = "text-red-500";
    
    return {
      summary: `${poids}kg · ${taille}cm · IMC ${imc.toFixed(1)}`,
      color
    };
  }, [profile.bodyProfile]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-headline text-white leading-none">
              {profile.name ? `Bonjour ${profile.name} !` : "Bonjour !"}
            </h1>
            <button 
              onClick={() => { if(confirm("Se déconnecter ?")) auth.signOut(); }}
              className="p-1 text-zinc-600 hover:text-[#E24B4A] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter",
              profile.location === 'maison' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-blue-500/10 border-blue-500/20 text-blue-500"
            )}>
              {profile.location === 'maison' ? <HomeIcon className="w-3 h-3" /> : <Dumbbell className="w-3 h-3" />}
              {profile.location === 'maison' ? "Mode Maison" : "Mode Salle"}
            </div>
          </div>
        </div>
        <div className="bg-[#E24B4A]/10 px-4 py-2 rounded-full flex items-center gap-2 border border-[#E24B4A]/20">
          <Flame className="w-4 h-4 text-[#E24B4A] fill-[#E24B4A]" />
          <span className="text-sm font-bold text-white tracking-tighter">{streak} JOURS</span>
        </div>
      </header>

      <button onClick={() => setView("settings")} className="w-full bg-[#1A1A1A] p-[10px_14px] rounded-[10px] flex items-center justify-between border border-transparent hover:border-[#2A2A2A] transition-all">
        <div className="flex items-center gap-3">
          <span className="text-xl">{program.emoji}</span>
          <div className="text-left">
            <span className="text-[12px] font-bold text-white uppercase block leading-tight">{program.name}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
              {profile.level} · {profile.frequency}/sem
            </span>
          </div>
        </div>
        <div className="bg-[#E24B4A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1 shrink-0">
          Modifier <ChevronRight className="w-3 h-3" />
        </div>
      </button>

      {weekOffset === 0 && (
        <Card className={cn("p-5 rounded-2xl border-none relative overflow-hidden shadow-2xl transition-all", finishedToday || todayIsRest ? "bg-[#1A4A2A]" : "bg-[#E24B4A]")}>
          <div className="relative z-10 space-y-4">
            <div>
              <h3 className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", finishedToday || todayIsRest ? "text-green-400" : "text-white/70")}>
                {finishedToday ? "Bravo !" : todayIsRest ? "Jour de repos 💤" : "Séance du jour"}
              </h3>
              <h4 className="text-2xl font-headline text-white leading-tight uppercase">
                {finishedToday ? "SÉANCE TERMINÉE ✓" : todayIsRest ? "RÉCUPÉRATION" : todaySessionDisplayName}
              </h4>
            </div>
            {!finishedToday && todaySession && !todayIsRest && (
              <Button onClick={() => onStartSession(todaySessionId ?? undefined)} className="w-full h-11 bg-white text-[#E24B4A] rounded-xl text-base font-headline hover:bg-white/90 shadow-xl press-effect ripple">
                C'EST PARTI !
              </Button>
            )}
          </div>
        </Card>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline text-white tracking-wide">PLANNING</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(w => w - 1)} className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setWeekOffset(w => w + 1)} className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {DAY_NAMES.map((day, idx) => {
            const sessionId = schedule[day];
            const session = program.sessions.find(s => s.id === sessionId);
            const date = weekDates[idx];
            const isToday = weekOffset === 0 && idx === currentDayIdx;
            const isDone = completedDates.includes(date.toISOString().split('T')[0]);
            return (
              <div key={day} className={cn("p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0", isToday ? "bg-[#E24B4A]/5" : "")}>
                <div className="flex flex-col">
                  <span className={cn("text-xs font-bold", isToday ? "text-[#E24B4A]" : "text-zinc-500")}>{day}</span>
                  <span className="text-[14px] text-white font-bold uppercase truncate max-w-[150px]">
                    {session ? getSessionName(session) : "Repos"}
                  </span>
                </div>
                {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-zinc-800" />}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setView("progres")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3">
          <Activity className="w-6 h-6 text-[#EE3BAA]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
        </button>
        <button onClick={() => setView("nutrition")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3">
          <Utensils className="w-6 h-6 text-[#E24B4A]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
        </button>
        <button onClick={() => setView("planning-mensuel")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3">
          <CalendarDays className="w-6 h-6 text-purple-400" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Mois</span>
        </button>
      </div>

      <section>
        <button onClick={() => setView("body-profile")} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-[12px] font-bold text-white uppercase block leading-tight">Mon profil corporel 📊</span>
              <span className={cn("text-[10px] font-bold uppercase tracking-tight", bodyProfileStats?.color || "text-zinc-500")}>
                {bodyProfileStats?.summary || "Complète tes mesures"}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
        </button>
      </section>
    </div>
  );
}
