"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS, Session, Exercise, Program } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Activity, Utensils, MessageSquare, Lightbulb, CheckCircle2, Circle, ChevronRight, ChevronLeft, Clock, Timer, Zap, Info, Dumbbell, Home as HomeIcon, BarChart, Pencil, Check, X, RotateCcw, Lock, Unlock, GripVertical, CalendarDays } from "lucide-react";import { useMemo, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
  onStartSession: (sessionId?: string) => void;
};

const OBJECTIVE_TIPS: Record<string, string> = {
  "gros-bras": "Focus sur la contraction volontaire, ne balance pas les charges !",
  "pectoraux": "Garde les omoplates serrées sur le banc pour protéger tes épaules.",
  "dos-large": "Imagine que tu tires avec tes coudes, pas avec tes mains.",
  "full-body": "Priorise les mouvements polyarticulaires pour brûler plus de calories.",
  "jambes": "Descends au moins jusqu'à la parallèle pour engager les fessiers.",
  "abdos": "La sangle abdominale se forge aussi dans l'assiette, reste hydraté."
};

const MONTHS = ["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getRotatedSchedule(
  baseSchedule: Record<string, string | null>,
  weekOffset: number,
  program: Program
): Record<string, string | null> {
  const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const sessions = program.sessions.filter(s => !s.isRestDay);
  const trainingDays = dayNamesFull.filter(day => baseSchedule[day]);
  if (trainingDays.length === 0 || sessions.length === 0) return baseSchedule;

  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + weekOffset * 7);
  const weekNum = getWeekNumber(targetDate);
  const rotation = weekNum % sessions.length;

  const newSchedule: Record<string, string | null> = {};
  dayNamesFull.forEach(day => { newSchedule[day] = null; });

  const todayIdx = (new Date().getDay() + 6) % 7;

  if (weekOffset === 0) {
    // Semaine en cours : jours passés = on lit le planning sauvegardé
    const savedRaw = typeof window !== 'undefined' ? localStorage.getItem("muscleup_schedule") : null;
    const saved = savedRaw ? JSON.parse(savedRaw) : {};
    dayNamesFull.forEach((day, idx) => {
      if (idx < todayIdx) {
        newSchedule[day] = saved[day] ?? null;
      }
    });
  }

  // Jours futurs (aujourd'hui inclus si semaine en cours)
  trainingDays.forEach((day, idx) => {
    const sessionIdx = (idx + rotation) % sessions.length;
    newSchedule[day] = sessions[sessionIdx].id;
  });

  return newSchedule;
}
function ExerciseAnimation({ muscle }: { muscle: string }) {
  const m = muscle.toLowerCase();
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#1A1A1A] rounded-xl border border-zinc-800 mb-6 mx-auto w-[200px] h-[200px] relative overflow-hidden shadow-2xl">
      <svg width="160" height="160" viewBox="0 0 200 200" className="mx-auto">
        <style>{`
          @keyframes curl{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-80deg)}}
          @keyframes extension{0%,100%{transform:rotate(0deg)}50%{transform:rotate(110deg)}}
          @keyframes press{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
          @keyframes squat{0%,100%{transform:translateY(0)}50%{transform:translateY(40px)}}
          @keyframes crunch{0%,100%{transform:rotate(0deg)}50%{transform:rotate(15deg)}}
          @keyframes arrow{0%,100%{opacity:0.2;transform:scale(0.9)}50%{opacity:1;transform:scale(1.1)}}
          .animate-curl{transform-origin:70px 100px;animation:curl 2s ease-in-out infinite}
          .animate-extension{transform-origin:100px 60px;animation:extension 2s ease-in-out infinite}
          .animate-press{animation:press 2s ease-in-out infinite}
          .animate-squat{animation:squat 2s ease-in-out infinite}
          .animate-crunch{transform-origin:100px 130px;animation:crunch 2s ease-in-out infinite}
          .animate-arrow{animation:arrow 2s ease-in-out infinite}
        `}</style>
        {(m.includes('bicep')||m.includes('avant-bras'))&&(<g><path d="M40 100 L70 100" stroke="#444" strokeWidth="8" strokeLinecap="round"/><g className="animate-curl"><path d="M70 100 L110 100" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round"/><circle cx="115" cy="100" r="10" fill="#E24B4A"/></g><circle cx="40" cy="100" r="12" fill="#444"/><path d="M140 70 L140 130 M140 70 L130 85 M140 70 L150 85" fill="none" stroke="#E24B4A" strokeWidth="3" className="animate-arrow"/></g>)}
        {m.includes('tricep')&&(<g><path d="M100 20 L100 60" stroke="#444" strokeWidth="8" strokeLinecap="round"/><g className="animate-extension"><path d="M100 60 L100 110" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round"/><circle cx="100" cy="115" r="10" fill="#E24B4A"/></g><circle cx="100" cy="20" r="12" fill="#444"/><path d="M140 110 L140 50 M140 110 L130 95 M140 110 L150 95" fill="none" stroke="#E24B4A" strokeWidth="3" className="animate-arrow"/></g>)}
        {(m.includes('pectoro')||m.includes('épaule'))&&(<g><rect x="50" y="140" width="100" height="10" fill="#444" rx="5"/><g className="animate-press"><path d="M60 140 L60 80 M140 140 L140 80" stroke="#444" strokeWidth="4"/><path d="M50 80 L150 80" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g><path d="M100 40 L100 70 M90 55 L100 40 L110 55" fill="none" stroke="#E24B4A" strokeWidth="3" className="animate-arrow"/></g>)}
        {(m.includes('dos')||m.includes('dorsal')||m.includes('trapèze'))&&(<g><rect x="50" y="40" width="100" height="10" fill="#444" rx="5"/><g className="animate-press" style={{animationDirection:'reverse'}}><path d="M60 40 L60 100 M140 40 L140 100" stroke="#444" strokeWidth="4"/><path d="M50 100 L150 100" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g><path d="M100 130 L100 160 M90 145 L100 160 L110 145" fill="none" stroke="#E24B4A" strokeWidth="3" className="animate-arrow"/></g>)}
        {(m.includes('jambe')||m.includes('quadri')||m.includes('ischio')||m.includes('fessier'))&&(<g><rect x="40" y="170" width="120" height="10" fill="#444" rx="5"/><g className="animate-squat"><circle cx="100" cy="40" r="15" fill="#444"/><path d="M100 55 L100 110" stroke="#444" strokeWidth="10" strokeLinecap="round"/><path d="M100 110 L80 170 M100 110 L120 170" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g><path d="M150 150 L150 110 M140 125 L150 110 L160 125" fill="none" stroke="#E24B4A" strokeWidth="3" className="animate-arrow"/></g>)}
        {m.includes('abdo')&&(<g><rect x="40" y="140" width="120" height="10" fill="#444" rx="5"/><g className="animate-crunch"><path d="M100 140 L100 80" stroke="#E24B4A" strokeWidth="12" strokeLinecap="round"/><circle cx="100" cy="65" r="15" fill="#444"/></g><path d="M60 80 Q80 60 100 80" fill="none" stroke="#E24B4A" strokeWidth="3" strokeDasharray="5,5" className="animate-arrow"/></g>)}
        {!['bicep','avant-bras','tricep','pectoro','épaule','dos','dorsal','trapèze','jambe','quadri','ischio','fessier','abdo'].some(k=>m.includes(k))&&(<g opacity="0.5"><circle cx="100" cy="60" r="20" fill="#444"/><rect x="80" y="85" width="40" height="80" rx="10" fill="#444"/></g>)}
      </svg>
      <span className="absolute bottom-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Mouvement</span>
    </div>
  );
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

export default function Hub({ profile, setView, onStartSession }: HubProps) {
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [isSessionPickerOpen, setIsSessionPickerOpen] = useState(false);
  const [selectedPreviewSession, setSelectedPreviewSession] = useState<{session: Session, day: string, date: Date} | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [draggedDay, setDraggedDay] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);
  const [longPressActive, setLongPressActive] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [manualSchedule, setManualSchedule] = useState<Record<string, string | null> | null>(null);
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const planningRef = useRef<HTMLDivElement | null>(null);
  const program = useMemo(() => PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);

  useEffect(() => {
    if (selectedPreviewSession || selectedExercise || longPressActive) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [selectedPreviewSession, selectedExercise, longPressActive]);

  useEffect(() => {
    const el = planningRef.current;
    if (!el) return;
    const preventScroll = (e: TouchEvent) => {
      if (touchDragDay.current) e.preventDefault();
    };
    el.addEventListener('touchmove', preventScroll, { passive: false });
    return () => el.removeEventListener('touchmove', preventScroll);
  }, []);

  const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const currentDayIdx = (new Date().getDay() + 6) % 7;
  const todayName = dayNamesFull[currentDayIdx];

  useEffect(() => {
    const savedHistory = localStorage.getItem("muscleup_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedDates = localStorage.getItem("completedDates");
    if (savedDates) setCompletedDates(JSON.parse(savedDates));
    const savedNames = localStorage.getItem("muscleup_session_names");
    if (savedNames) setCustomNames(JSON.parse(savedNames));
    const savedManual = localStorage.getItem("muscleup_manual_schedule");
    const savedBase = localStorage.getItem("muscleup_schedule");
    if (savedManual && savedBase) {
      const manual = JSON.parse(savedManual);
      const base = JSON.parse(savedBase);
      const manualDays = Object.values(manual).filter(Boolean).length;
      const baseDays = Object.values(base).filter(Boolean).length;
      if (manualDays !== baseDays) {
        setManualSchedule(null);
        localStorage.removeItem("muscleup_manual_schedule");
      } else {
        setManualSchedule(manual);
      }
    } else if (savedManual) {
      setManualSchedule(JSON.parse(savedManual));
    }
  }, []);

  const saveCustomName = (sessionId: string, name: string) => {
    const updated = { ...customNames, [sessionId]: name };
    setCustomNames(updated);
    localStorage.setItem("muscleup_session_names", JSON.stringify(updated));
    toast({ title: "Nom mis à jour ✓", description: `La séance s'appelle maintenant "${name}".` });
  };

  const resetCustomName = (sessionId: string) => {
    const updated = { ...customNames };
    delete updated[sessionId];
    setCustomNames(updated);
    localStorage.setItem("muscleup_session_names", JSON.stringify(updated));
    toast({ title: "Nom réinitialisé", description: "Le nom d'origine a été restauré." });
  };

  const getSessionName = (session: Session) => customNames[session.id] || session.name;

  const finishedToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return completedDates.includes(todayStr);
  }, [completedDates]);

  const streak = useMemo(() => {
    const dates = Array.from(new Set(completedDates)).sort().reverse();
    if (dates.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (dates[0] !== today && dates[0] !== yesterdayStr) return 0;
    let count = 0;
    let checkDate = dates[0] === today ? new Date() : yesterday;
    while (dates.includes(checkDate.toISOString().split('T')[0])) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return count;
  }, [completedDates]);

  const baseSchedule = useMemo<Record<string, string | null>>(() => {
    if (typeof window === 'undefined') return {};
    // Utilise le planning type pour les rotations des semaines futures
    const savedBase = localStorage.getItem("muscleup_base_schedule");
    if (savedBase) return JSON.parse(savedBase);
    // Fallback sur le planning courant
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    const mapping: Record<string, string | null> = {};
    dayNamesFull.forEach(d => {
      const s = program.sessions.find(ps => ps.day === d);
      mapping[d] = s ? s.id : null;
    });
    return mapping;
  }, [program]);

  const currentWeekSchedule = useMemo<Record<string, string | null>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    return {};
  }, []);

  const rotatedSchedule = useMemo(() => {
    // Semaine en cours : on lit directement muscleup_schedule
    if (weekOffset === 0) return currentWeekSchedule;
    // Semaines passées : on affiche vide, l'historique est dans completedDates
    if (weekOffset < 0) {
      const empty: Record<string, string | null> = {};
      dayNamesFull.forEach(d => { empty[d] = null; });
      return empty;
    }
    // Semaines futures : on utilise baseSchedule avec rotation
    return getRotatedSchedule(baseSchedule, weekOffset, program);
  }, [baseSchedule, weekOffset, program, currentWeekSchedule]);

  const schedule = manualSchedule || rotatedSchedule;

  const swapDays = (dayA: string, dayB: string) => {
    if (weekOffset !== 0) return;
    const idxA = dayNamesFull.indexOf(dayA);
    const idxB = dayNamesFull.indexOf(dayB);
    if (idxA < currentDayIdx) return;
    if (idxB < currentDayIdx) return;
    const dateA = weekDates[idxA]?.toISOString().split('T')[0];
    const dateB = weekDates[idxB]?.toISOString().split('T')[0];
    if (dateA && completedDates.includes(dateA)) return;
    if (dateB && completedDates.includes(dateB)) return;
    const base = { ...schedule };
    const tmp = base[dayA];
    base[dayA] = base[dayB];
    base[dayB] = tmp;
    setManualSchedule(base);
    localStorage.setItem("muscleup_manual_schedule", JSON.stringify(base));
  };

  const resetToOptimal = () => {
    setManualSchedule(null);
    localStorage.removeItem("muscleup_manual_schedule");
    toast({ title: "Planning réinitialisé ✓", description: "Le planning optimal a été restauré." });
  };

  const todaySessionId = schedule[todayName];
  const todaySession = program.sessions.find(s => s.id === todaySessionId);
  const todaySessionDisplayName = todaySession ? getSessionName(todaySession) : "Repos aujourd'hui";
  const todayIsRest = !todaySession || todaySession.isRestDay;

  const weekDates = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);
    return dayNamesFull.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset, currentDayIdx]);

  const weekLabel = useMemo(() => {
    const first = weekDates[0];
    const last = weekDates[6];
    if (first.getMonth() === last.getMonth()) return `${first.getDate()} – ${last.getDate()} ${MONTHS[first.getMonth()]}`;
    return `${first.getDate()} ${MONTHS[first.getMonth()]} – ${last.getDate()} ${MONTHS[last.getMonth()]}`;
  }, [weekDates]);

  const weekNumber = useMemo(() => {
    const now = new Date();
    const target = new Date(now);
    target.setDate(now.getDate() + weekOffset * 7);
    return getWeekNumber(target);
  }, [weekOffset]);

  const dayStatuses = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return weekDates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      if (completedDates.includes(dateStr)) return "done";
      if (dateStr < todayStr) return "past";
      return "upcoming";
    });
  }, [weekDates, completedDates]);

  const weeklySessionsDone = useMemo(() => {
    if (weekOffset !== 0) return 0;
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);
    monday.setHours(0,0,0,0);
    return history.filter(h => h.date && new Date(h.date) >= monday).length;
  }, [history, currentDayIdx, weekOffset]);

  const totalWeeklyGoal = parseInt(profile.frequency) || 3;
  const weeklyProgressPercent = Math.min((weeklySessionsDone / totalWeeklyGoal) * 100, 100);

  const isHome = profile.location === 'maison';

  const bodyStatsSummary = useMemo(() => {
    if (!profile.bodyProfile) return null;
    const { poids, taille } = profile.bodyProfile;
    const imc = (poids / ((taille / 100) ** 2)).toFixed(1);
    return `${poids}kg · ${taille}cm · IMC ${imc}`;
  }, [profile.bodyProfile]);

  const handleDragStart = (dayName: string) => setDraggedDay(dayName);
  const handleDragOver = (e: React.DragEvent, dayName: string) => {
    e.preventDefault();
    setDragOverDay(dayName);
  };
  const handleDrop = (dayName: string) => {
    if (draggedDay && draggedDay !== dayName) swapDays(draggedDay, dayName);
    setDraggedDay(null);
    setDragOverDay(null);
  };

  const touchDragDay = useRef<string | null>(null);
  const handleTouchStartDrag = (e: React.TouchEvent, dayName: string) => {
    longPressTimer.current = setTimeout(() => {
      try { navigator.vibrate?.(50); } catch {}
      setLongPressActive(true);
      touchDragDay.current = dayName;
      setDraggedDay(dayName);
    }, 500);
  };

  const handleTouchCancelDrag = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };
  const handleTouchMoveDrag = (e: React.TouchEvent) => {
    if (!touchDragDay.current) return;
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const row = el?.closest('[data-day]') as HTMLElement | null;
    if (row) setDragOverDay(row.dataset.day || null);
  };
  const handleTouchEndDrag = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (touchDragDay.current && dragOverDay && touchDragDay.current !== dragOverDay) {
      swapDays(touchDragDay.current, dragOverDay);
    }
    touchDragDay.current = null;
    setDraggedDay(null);
    setDragOverDay(null);
    setLongPressActive(false);
  };

  return (
    <>
      <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-20">

        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-headline text-white leading-none">
              {profile.name ? `Bonjour ${profile.name} !` : "Bonjour !"}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter",
                isHome ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-blue-500/10 border-blue-500/20 text-blue-500"
              )}>
                {isHome ? <HomeIcon className="w-3 h-3" /> : <Dumbbell className="w-3 h-3" />}
                {isHome ? "Mode Maison" : "Mode Salle"}
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
                {profile.level} · {profile.frequency}/sem · {isHome ? 'Équipement réduit' : 'Full équipement'}
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
                <p className={cn("font-medium text-sm", finishedToday || todayIsRest ? "text-green-200" : "text-white/80")}>
                  {finishedToday ? "Ton corps te remercie. Repose-toi bien !" : todayIsRest ? "Profite pour bien récupérer et t'hydrater." : (todaySession ? `Durée estimée : ${todaySession.duration}` : "Profite pour bien récupérer.")}
                </p>
              </div>
              {!finishedToday && todaySession && !todayIsRest && (
                <Button onClick={() => onStartSession(todaySessionId || undefined)} className="w-full h-11 bg-white text-[#E24B4A] rounded-xl text-base font-headline hover:bg-white/90 shadow-xl press-effect ripple">
                  C'EST PARTI !
                </Button>
              )}
              {!finishedToday && !todayIsRest && (
                <button onClick={() => setIsSessionPickerOpen(true)} className="w-full text-center text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Choisir une autre séance →
                </button>
              )}
            </div>
          </Card>
        )}

        <Dialog open={isSessionPickerOpen} onOpenChange={setIsSessionPickerOpen}>
          <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">CHOISIR UNE SÉANCE</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {program.sessions.filter(s => !s.isRestDay).map((s) => (
                <button key={s.id} onClick={() => { onStartSession(s.id); setIsSessionPickerOpen(false); }}
                  className="w-full p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-left hover:border-[#E24B4A] transition-all flex justify-between items-center group">
                  <div>
                    <div className="font-headline text-xl uppercase">{getSessionName(s)}</div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.exercises.length} exercices • {s.duration}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#E24B4A]/10 flex items-center justify-center group-hover:bg-[#E24B4A] transition-colors">
                    <Activity className="w-4 h-4 text-[#E24B4A] group-hover:text-white" />
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-headline text-white tracking-wide">PLANNING</h2>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
                Semaine {weekNumber} · {weekLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)} disabled={weekOffset <= -4}
                className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E24B4A] disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-zinc-500 uppercase min-w-[70px] text-center">
                {weekOffset === 0 ? "Cette sem." : weekOffset > 0 ? `+${weekOffset} sem.` : `${weekOffset} sem.`}
              </span>
              <button onClick={() => setWeekOffset(w => w + 1)} disabled={weekOffset >= 8}
                className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#E24B4A] disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {weekOffset !== 0 && (
            <div className="bg-[#1A1A1A] border border-[#E24B4A]/20 rounded-xl p-3 flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Semaine {weekNumber}</p>
              <button onClick={() => setWeekOffset(0)} className="text-[10px] font-bold text-white bg-[#E24B4A] px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1">
                📅 Aujourd'hui
              </button>
            </div>
          )}

          <div
            ref={planningRef}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl select-none"
            onTouchMove={handleTouchMoveDrag}
            onTouchEnd={handleTouchEndDrag}
            style={{ touchAction: longPressActive ? 'none' : 'pan-y', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' } as React.CSSProperties}
          >
            {dayNamesFull.map((dayName: string, idx: number) => {
              const sessionId = schedule[dayName];
              const session = program.sessions.find(s => s.id === sessionId);
              const isDone = dayStatuses[idx] === "done";
              const date = weekDates[idx];
              const isToday = weekOffset === 0 && idx === currentDayIdx;
              const isRest = !session || session.isRestDay;
              const dateLabel = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
              const isDragging = draggedDay === dayName && longPressActive;
              const isDropTarget = dragOverDay === dayName && draggedDay !== dayName;
              const isPast = dayStatuses[idx] === "past";

              return (
                <div
                  key={dayName}
                  data-day={dayName}
                  ref={el => { dayRefs.current[dayName] = el; }}
                  style={isDragging ? { backgroundColor: '#3A3A3A', opacity: 0.5, border: '2px dashed #E24B4A' } : isDropTarget ? { backgroundColor: 'rgba(226,75,74,0.2)', borderLeft: '4px solid #E24B4A' } : {}}
                  draggable={!isRest && !isPast}
                  onDragStart={!isRest && !isPast ? () => handleDragStart(dayName) : undefined}
                  onDragOver={(e) => handleDragOver(e, dayName)}
                  onDrop={() => handleDrop(dayName)}
                  onDragEnd={() => { setDraggedDay(null); setDragOverDay(null); }}
                  onTouchStart={!isRest && !isPast ? (e) => handleTouchStartDrag(e, dayName) : undefined}
                  onTouchCancel={handleTouchCancelDrag}
                  onClick={() => !longPressActive && !isRest && !isPast && session && setSelectedPreviewSession({ session, day: dayName, date })}
                  className={cn(
                    "p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0 transition-all duration-150",
                    isToday ? "bg-[#E24B4A]/5" : "",
                    isPast && !isDone ? "opacity-40 pointer-events-none" : "",
                    isDone ? "!bg-[#4CAF50]/10 hover:!bg-[#4CAF50]/10" : "",
                    !longPressActive && !isRest && !isPast ? "cursor-pointer hover:bg-white/5" : "",
                    !isRest && !isPast ? "cursor-grab active:cursor-grabbing" : "",
                    isDragging ? "!bg-zinc-700 opacity-60 border-dashed" : "",
                    isDropTarget ? "!bg-[#E24B4A]/20 border-l-4 border-l-[#E24B4A]" : "",
                    longPressActive && draggedDay === dayName ? "touch-none" : "",
                  )}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {!isRest && draggedDay === dayName && (
                      <GripVertical className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                    <div className="w-20 flex-shrink-0">
                      <span className={cn("text-xs font-bold block", isToday ? "text-[#E24B4A]" : "text-zinc-500")}>{dayName}</span>
                      <span className="text-[10px] text-zinc-700 font-bold">{dateLabel}</span>
                    </div>
                    {!isRest && session ? (
                      <EditableSessionName
                        sessionId={session.id}
                        defaultName={session.name}
                        currentName={getSessionName(session)}
                        onSave={saveCustomName}
                        onReset={resetCustomName}
                        onEditingChange={(editing) => setEditingSessionId(editing ? session.id : null)}
                        className={cn("text-sm uppercase tracking-tight", isToday ? "text-white" : "text-zinc-400")}
                      />
                    ) : (
                      <span className="text-sm font-bold uppercase tracking-tight text-zinc-700">REPOS</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {!longPressActive && !isRest && !isPast && editingSessionId !== session?.id && (
                      <button onClick={(e) => { e.stopPropagation(); setSelectedPreviewSession({ session: session!, day: dayName, date }); }}
                        className="text-zinc-600 hover:text-zinc-300 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    {editingSessionId !== session?.id && (
                      isDone
                        ? <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-[#4CAF50] uppercase tracking-widest hidden sm:block">Validé</span>
                            <CheckCircle2 className="w-5 h-5 text-[#4CAF50] fill-[#4CAF50]/20" />
                          </div>
                        : dayStatuses[idx] === "past"
                          ? <span className="text-[10px] font-bold text-zinc-700 uppercase">—</span>
                          : isToday && !isRest
                            ? <Circle className="w-4 h-4 text-[#E24B4A]" />
                            : <Circle className="w-4 h-4 text-zinc-800" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setView("progres")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors">
            <Activity className="w-6 h-6 text-[#EE3BAA]" />
            <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
          </button>
          <button onClick={() => setView("nutrition")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors">
            <Utensils className="w-6 h-6 text-[#E24B4A]" />
            <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
          </button>
          <button onClick={() => setView("planning-mensuel")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors">
            <CalendarDays className="w-6 h-6 text-purple-400" />
            <span className="text-[10px] font-bold uppercase text-zinc-400">Planning</span>
          </button>
        </div>

        <section>
          <button onClick={() => setView("body-profile")}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex items-center justify-between hover:bg-[#2A2A2A] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-[12px] font-bold text-white uppercase block leading-tight">Mon profil corporel 📊</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                  {bodyStatsSummary || "Complète tes mesures"}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-headline text-white tracking-wide">CONSEIL DU JOUR</h2>
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed italic">
              "{OBJECTIVE_TIPS[profile.objective] || "Reste constant, les résultats viendront avec le temps."}"
            </p>
          </Card>
        </section>

        <section className="space-y-4 pb-10">
          <h2 className="text-xl font-headline text-white tracking-wide">MA PROGRESSION</h2>
          <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl font-headline text-white leading-none">{weeklySessionsDone} / {totalWeeklyGoal}</span>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Séances cette semaine</p>
              </div>
              <span className="text-xl font-headline text-[#E24B4A]">{Math.round(weeklyProgressPercent)}%</span>
            </div>
            <Progress value={weeklyProgressPercent} className="h-3 bg-[#0F0F0F]" />
          </Card>
        </section>

      </div>

      {selectedPreviewSession && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70" onClick={() => setSelectedPreviewSession(null)}>
          <div className="w-full max-w-[430px] bg-[#1A1A1A] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto transition-transform"
            onClick={e => e.stopPropagation()}
            onTouchStart={e => {
              const el = e.currentTarget;
              el.dataset.touchY = String(e.touches[0].clientY);
              el.style.transition = 'none';
            }}
            onTouchMove={e => {
              const el = e.currentTarget;
              const startY = Number(el.dataset.touchY);
              const delta = e.touches[0].clientY - startY;
              if (delta > 0) el.style.transform = `translateY(${delta}px)`;
            }}
            onTouchEnd={e => {
              const el = e.currentTarget;
              const startY = Number(el.dataset.touchY);
              const endY = e.changedTouches[0].clientY;
              const delta = endY - startY;
              el.style.transition = 'transform 0.3s ease';
              if (delta > 100) {
                el.style.transform = 'translateY(100%)';
                setTimeout(() => setSelectedPreviewSession(null), 300);
              } else {
                el.style.transform = 'translateY(0)';
              }
            }}
          >
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0 mr-4">
                <EditableSessionName
                  sessionId={selectedPreviewSession.session.id}
                  defaultName={selectedPreviewSession.session.name}
                  currentName={getSessionName(selectedPreviewSession.session)}
                  onSave={saveCustomName}
                  onReset={resetCustomName}
                  className="text-3xl text-[#E24B4A] uppercase leading-none"
                />
                <div className="flex items-center gap-3 mt-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                  <span>{selectedPreviewSession.day} {selectedPreviewSession.date.getDate()} {MONTHS[selectedPreviewSession.date.getMonth()]}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{selectedPreviewSession.session.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {(profile.location === 'maison' && selectedPreviewSession.session.homeExercises
                ? selectedPreviewSession.session.homeExercises
                : selectedPreviewSession.session.exercises
              ).map((ex, i) => (
                <div key={i} onClick={() => setSelectedExercise(ex)}
                  className="bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A] flex items-center gap-4 cursor-pointer hover:border-[#E24B4A]/50 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center font-headline text-xl text-[#E24B4A] flex-shrink-0 group-hover:bg-[#E24B4A] group-hover:text-white transition-colors">{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-white uppercase tracking-tight">{ex.name}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">{ex.sets} × {ex.reps}</span>
                      <span className="text-[10px] font-bold text-[#EE3BAA] uppercase tracking-tighter">{ex.muscle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Button onClick={() => { onStartSession(selectedPreviewSession.session.id); setSelectedPreviewSession(null); }}
                className="w-full h-14 bg-[#E24B4A] text-white font-headline text-xl rounded-xl shadow-xl press-effect ripple">
                {selectedPreviewSession.day === todayName && weekOffset === 0 ? "C'EST PARTI !" : "LANCER CETTE SÉANCE"}
              </Button>
              <button onClick={() => setSelectedPreviewSession(null)}
                className="w-full text-center text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 py-3 transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedExercise && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80" onClick={() => setSelectedExercise(null)}>
          <div className="w-full max-w-[430px] bg-[#1A1A1A] rounded-t-[30px] p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            <ExerciseAnimation muscle={selectedExercise.muscle} />
            <header className="mb-8 text-center">
              <h2 className="text-4xl font-headline text-primary uppercase leading-none mb-3">{selectedExercise.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-[#EE3BAA]/10 text-[#EE3BAA] text-[10px] font-bold uppercase rounded-md border border-[#EE3BAA]/20">{selectedExercise.muscle}</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase rounded-md">{selectedExercise.sets} Séries × {selectedExercise.reps}</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Timer className="w-3 h-3" /> {selectedExercise.rest}</span>
              </div>
            </header>
            <div className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Position & Mouvement</h3></div>
                <p className="text-sm text-zinc-300 leading-relaxed bg-[#0F0F0F] p-5 rounded-2xl border border-zinc-800/50">{selectedExercise.position}</p>
              </section>
              <section className="space-y-3">
                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-[#EE3BAA]" /><h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Conseil technique</h3></div>
                <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-[#EE3BAA] pl-4">"{selectedExercise.technique}"</p>
              </section>
              <Button onClick={() => setSelectedExercise(null)} className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-headline text-xl rounded-xl transition-colors">FERMER</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
