
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS, Exercise } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Timer, Info, Zap, Play, Activity, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { auth } from "@/lib/firebase";

function getSuggestedWeight(exercise: Exercise, profile: UserProfile): string | null {
  const bodyWeight = profile.bodyProfile?.poids;
  if (!bodyWeight) return null;
  const level = profile.level?.toLowerCase() || 'débutant';
  const objective = profile.objective?.toLowerCase() || '';
  const levelMulti = level.includes('avancé') ? 2.0 : level.includes('inter') ? 1.5 : 1.0;
  const objMulti = objective.includes('force') ? 1.3
    : objective.includes('masse') || objective.includes('bras') || objective.includes('pectoral') || objective.includes('jambe') || objective.includes('dos') ? 1.1
    : objective.includes('sèche') || objective.includes('abdos') ? 0.85 : 1.0;
  const muscle = exercise.muscle.toLowerCase();
  const name = exercise.name.toLowerCase();
  let ratio = 0;
  if (name.includes('squat') || name.includes('presse') || name.includes('leg press')) ratio = 0.8;
  else if (name.includes('soulevé') || name.includes('deadlift') || name.includes('roumain')) ratio = 0.7;
  else if (name.includes('hip thrust')) ratio = 0.6;
  else if (name.includes('développé couché') || name.includes('bench press')) ratio = 0.4;
  else if (name.includes('développé incliné') || name.includes('incline press')) ratio = 0.35;
  else if (name.includes('développé militaire') || name.includes('overhead press')) ratio = 0.25;
  else if (name.includes('rowing barre') || name.includes('bent over row')) ratio = 0.4;
  else if (name.includes('rowing haltère') || name.includes('dumbbell row')) ratio = 0.25;
  else if (name.includes('tirage') || name.includes('pulldown') || name.includes('traction')) ratio = 0.35;
  else if (name.includes('curl barre') || name.includes('ez bar curl')) ratio = 0.15;
  else if (name.includes('curl') || muscle.includes('bicep')) ratio = 0.12;
  else if (name.includes('extension') || name.includes('skull') || muscle.includes('tricep')) ratio = 0.10;
  else if (name.includes('écarté') || name.includes('fly')) ratio = 0.15;
  else if (name.includes('mollet') || name.includes('calf')) ratio = 0.5;
  else if (name.includes('curl jambes') || name.includes('leg curl')) ratio = 0.25;
  else if (name.includes('extension jambes') || name.includes('leg extension')) ratio = 0.35;
  else if (muscle.includes('abdo') || muscle.includes('transverse') || muscle.includes('oblique')) return null;
  else if (name.includes('planche') || name.includes('plank') || name.includes('gainage')) return null;
  else ratio = 0.15;
  if (ratio === 0) return null;
  const raw = bodyWeight * ratio * levelMulti * objMulti;
  const rounded = Math.round(raw / 2.5) * 2.5;
  return `~${rounded} kg`;
}

function ExerciseAnimation({ muscle }: { muscle: string }) {
  const m = muscle.toLowerCase();
  return (
    <div className="flex flex-col items-center justify-center bg-[#1A1A1A] rounded-xl border border-zinc-800 mx-auto w-[110px] h-[110px] relative overflow-hidden">
      <svg width="90" height="90" viewBox="0 0 200 200" className="mx-auto">
        <style>{`
          @keyframes curl{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-80deg)}}
          @keyframes extension{0%,100%{transform:rotate(0deg)}50%{transform:rotate(110deg)}}
          @keyframes press{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
          @keyframes squat{0%,100%{transform:translateY(0)}50%{transform:translateY(40px)}}
          @keyframes crunch{0%,100%{transform:rotate(0deg)}50%{transform:rotate(15deg)}}
          .animate-curl{transform-origin:70px 100px;animation:curl 2s ease-in-out infinite}
          .animate-extension{transform-origin:100px 60px;animation:extension 2s ease-in-out infinite}
          .animate-press{animation:press 2s ease-in-out infinite}
          .animate-squat{animation:squat 2s ease-in-out infinite}
          .animate-crunch{transform-origin:100px 130px;animation:crunch 2s ease-in-out infinite}
        `}</style>
        {(m.includes('bicep')||m.includes('avant-bras'))&&(<g><path d="M40 100 L70 100" stroke="#444" strokeWidth="8" strokeLinecap="round"/><g className="animate-curl"><path d="M70 100 L110 100" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round"/><circle cx="115" cy="100" r="10" fill="#E24B4A"/></g><circle cx="40" cy="100" r="12" fill="#444"/></g>)}
        {m.includes('tricep')&&(<g><path d="M100 20 L100 60" stroke="#444" strokeWidth="8" strokeLinecap="round"/><g className="animate-extension"><path d="M100 60 L100 110" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round"/><circle cx="100" cy="115" r="10" fill="#E24B4A"/></g><circle cx="100" cy="20" r="12" fill="#444"/></g>)}
        {(m.includes('pectoro')||m.includes('épaule'))&&(<g><rect x="50" y="140" width="100" height="10" fill="#444" rx="5"/><g className="animate-press"><path d="M60 140 L60 80 M140 140 L140 80" stroke="#444" strokeWidth="4"/><path d="M50 80 L150 80" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g></g>)}
        {(m.includes('dos')||m.includes('dorsal')||m.includes('trapèze'))&&(<g><rect x="50" y="40" width="100" height="10" fill="#444" rx="5"/><g className="animate-press" style={{animationDirection:'reverse'}}><path d="M60 40 L60 100 M140 40 L140 100" stroke="#444" strokeWidth="4"/><path d="M50 100 L150 100" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g></g>)}
        {(m.includes('jambe')||m.includes('quadri')||m.includes('ischio')||m.includes('fessier')||m.includes('mollet'))&&(<g><rect x="40" y="170" width="120" height="10" fill="#444" rx="5"/><g className="animate-squat"><circle cx="100" cy="40" r="15" fill="#444"/><path d="M100 55 L100 110" stroke="#444" strokeWidth="10" strokeLinecap="round"/><path d="M100 110 L80 170 M100 110 L120 170" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g></g>)}
        {m.includes('abdo')&&(<g><rect x="40" y="140" width="120" height="10" fill="#444" rx="5"/><g className="animate-crunch"><path d="M100 140 L100 80" stroke="#E24B4A" strokeWidth="12" strokeLinecap="round"/><circle cx="100" cy="65" r="15" fill="#444"/></g></g>)}
        {!['bicep','avant-bras','tricep','pectoro','épaule','dos','dorsal','trapèze','jambe','quadri','ischio','fessier','mollet','abdo'].some(k=>m.includes(k))&&(<g opacity="0.5"><circle cx="100" cy="60" r="20" fill="#444"/><rect x="80" y="85" width="40" height="80" rx="10" fill="#444"/></g>)}
      </svg>
    </div>
  );
}

function ExerciseDetailModal({ exercise, onClose, profile }: { exercise: Exercise; onClose: () => void; profile: UserProfile }) {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loadingGif, setLoadingGif] = useState(true);
  const suggestedWeight = getSuggestedWeight(exercise, profile);

  useEffect(() => {
    const fetchGif = async () => {
      setLoadingGif(true);
      setGifUrl(null);
      try {
        const query = (exercise as any).nameEn || exercise.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const res = await fetch(`/api/exercise-gif?query=${encodeURIComponent(query)}`);
        const data = JSON.parse(await res.text());
        if (data.gifUrl) setGifUrl(data.gifUrl);
      } catch (e) {}
      finally { setLoadingGif(false); }
    };
    fetchGif();
  }, [exercise.name]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1A1A1A] rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { e.currentTarget.dataset.touchY = String(e.touches[0].clientY); }}
        onTouchEnd={e => { if (e.changedTouches[0].clientY - Number(e.currentTarget.dataset.touchY) > 80) onClose(); }}>
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />
        {loadingGif ? (
          <div className="w-[180px] h-[180px] mx-auto mb-4 bg-[#0F0F0F] rounded-xl border border-zinc-800 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#E24B4A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : gifUrl ? (
          <div className="mx-auto mb-4 w-[180px] h-[180px] rounded-xl overflow-hidden border border-zinc-800">
            <img src={gifUrl} alt={exercise.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-[#0F0F0F] rounded-xl border border-zinc-800 mb-4 mx-auto w-[180px] h-[180px] relative overflow-hidden">
            <svg width="140" height="140" viewBox="0 0 200 200">
              <style>{`
                @keyframes curl{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-80deg)}}
                @keyframes extension{0%,100%{transform:rotate(0deg)}50%{transform:rotate(110deg)}}
                @keyframes press{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
                @keyframes squat{0%,100%{transform:translateY(0)}50%{transform:translateY(40px)}}
                @keyframes crunch{0%,100%{transform:rotate(0deg)}50%{transform:rotate(15deg)}}
                .animate-curl2{transform-origin:70px 100px;animation:curl 2s ease-in-out infinite}
                .animate-extension2{transform-origin:100px 60px;animation:extension 2s ease-in-out infinite}
                .animate-press2{animation:press 2s ease-in-out infinite}
                .animate-squat2{animation:squat 2s ease-in-out infinite}
                .animate-crunch2{transform-origin:100px 130px;animation:crunch 2s ease-in-out infinite}
              `}</style>
              {(exercise.muscle.toLowerCase().includes('bicep')||exercise.muscle.toLowerCase().includes('avant-bras'))&&(<g><path d="M40 100 L70 100" stroke="#444" strokeWidth="8" strokeLinecap="round"/><g className="animate-curl2"><path d="M70 100 L110 100" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round"/><circle cx="115" cy="100" r="10" fill="#E24B4A"/></g><circle cx="40" cy="100" r="12" fill="#444"/></g>)}
              {exercise.muscle.toLowerCase().includes('tricep')&&(<g><path d="M100 20 L100 60" stroke="#444" strokeWidth="8" strokeLinecap="round"/><g className="animate-extension2"><path d="M100 60 L100 110" stroke="#E24B4A" strokeWidth="8" strokeLinecap="round"/><circle cx="100" cy="115" r="10" fill="#E24B4A"/></g><circle cx="100" cy="20" r="12" fill="#444"/></g>)}
              {(exercise.muscle.toLowerCase().includes('pectoro')||exercise.muscle.toLowerCase().includes('épaule'))&&(<g><rect x="50" y="140" width="100" height="10" fill="#444" rx="5"/><g className="animate-press2"><path d="M60 140 L60 80 M140 140 L140 80" stroke="#444" strokeWidth="4"/><path d="M50 80 L150 80" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g></g>)}
              {(exercise.muscle.toLowerCase().includes('dos')||exercise.muscle.toLowerCase().includes('dorsal'))&&(<g><rect x="50" y="40" width="100" height="10" fill="#444" rx="5"/><g className="animate-press2" style={{animationDirection:'reverse'}}><path d="M60 40 L60 100 M140 40 L140 100" stroke="#444" strokeWidth="4"/><path d="M50 100 L150 100" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g></g>)}
              {(exercise.muscle.toLowerCase().includes('jambe')||exercise.muscle.toLowerCase().includes('quadri')||exercise.muscle.toLowerCase().includes('ischio')||exercise.muscle.toLowerCase().includes('fessier'))&&(<g><rect x="40" y="170" width="120" height="10" fill="#444" rx="5"/><g className="animate-squat2"><circle cx="100" cy="40" r="15" fill="#444"/><path d="M100 55 L100 110" stroke="#444" strokeWidth="10" strokeLinecap="round"/><path d="M100 110 L80 170 M100 110 L120 170" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g></g>)}
              {exercise.muscle.toLowerCase().includes('abdo')&&(<g><rect x="40" y="140" width="120" height="10" fill="#444" rx="5"/><g className="animate-crunch2"><path d="M100 140 L100 80" stroke="#E24B4A" strokeWidth="12" strokeLinecap="round"/><circle cx="100" cy="65" r="15" fill="#444"/></g></g>)}
            </svg>
          </div>
        )}
        <h2 className="text-3xl font-headline text-[#E24B4A] uppercase text-center mb-3">{exercise.name}</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <span className="px-3 py-1 bg-[#EE3BAA]/10 text-[#EE3BAA] text-[11px] font-bold uppercase rounded-md border border-[#EE3BAA]/20">{exercise.muscle}</span>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase rounded-md">{exercise.sets} × {exercise.reps}</span>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase rounded-md flex items-center gap-1"><Timer className="w-3 h-3"/> {exercise.rest}</span>
          {suggestedWeight && <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[11px] font-bold uppercase rounded-md border border-amber-500/20">🏋️ {suggestedWeight}</span>}
        </div>
        {suggestedWeight && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
            <span className="text-xl">🏋️</span>
            <div>
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Poids conseillé</p>
              <p className="text-sm text-zinc-300">{suggestedWeight} · {profile.level}, {profile.bodyProfile?.poids}kg</p>
            </div>
          </div>
        )}
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-[#E24B4A]"/><span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Position & Mouvement</span></div>
            <p className="text-sm text-zinc-200 leading-relaxed bg-[#0F0F0F] p-4 rounded-xl border border-zinc-800">{exercise.position}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-[#EE3BAA]"/><span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Conseil technique</span></div>
            <p className="text-sm text-zinc-300 italic border-l-2 border-[#EE3BAA] pl-4 leading-relaxed">"{exercise.technique}"</p>
          </div>
        </div>
        <Button onClick={onClose} className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-headline text-lg rounded-xl press-effect">FERMER</Button>
      </div>
    </div>
  );
}

type ProgramTabProps = {
  profile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  manualSessionId?: string | null;
  onFinish?: () => void;
};

export default function ProgramTab({ profile, onBack, onUpdateProfile, manualSessionId, onFinish }: ProgramTabProps) {
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  const [internalSessionId, setInternalSessionId] = useState<string | null>(manualSessionId || null);
  const [phase, setPhase] = useState<"select" | "intro" | "countdown" | "workout">(manualSessionId ? "intro" : "select");
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [countdown, setCountdown] = useState(10);
  const [doneExercises, setDoneExercises] = useState<number[]>([]);
  const [justFinishedExercise, setJustFinishedExercise] = useState(false);

  const user = auth.currentUser;
  const uidPrefix = user ? `_${user.uid}` : "_guest";

  useEffect(() => {
    const savedNames = localStorage.getItem("muscleup_session_names" + uidPrefix);
    if (savedNames) setCustomNames(JSON.parse(savedNames));
  }, [uidPrefix]);

  const schedule = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem("muscleup_base_schedule" + uidPrefix) || localStorage.getItem("muscleup_schedule" + uidPrefix);
    if (saved) return JSON.parse(saved) as Record<string, string | null>;
    return null;
  }, [uidPrefix]);

  const currentSession = useMemo(() => {
    if (internalSessionId) return program.sessions.find(s => s.id === internalSessionId) || program.sessions[0];
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    const todayName = dayNamesFull[currentDayIdx];
    if (schedule && schedule[todayName]) return program.sessions.find(s => s.id === schedule[todayName]) || program.sessions[0];
    return program.sessions.find(s => s.day === todayName) || program.sessions[0];
  }, [program, internalSessionId, schedule]);

  const currentSessionDisplayName = customNames[currentSession.id] || currentSession.name;

  const currentExercises = useMemo(() => {
    if (profile.location === 'maison' && currentSession.homeExercises) return currentSession.homeExercises;
    return currentSession.exercises;
  }, [profile.location, currentSession]);

  const currentExercise = currentExercises[currentExIdx];
  const totalSets = parseInt(currentExercise?.sets || "1");
  const progress = ((doneExercises.length + (currentSet - 1) / totalSets) / currentExercises.length) * 100;

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("workout"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  useEffect(() => {
    if (!isResting || phase !== "workout") return;
    if (restTime <= 0) {
      setIsResting(false);
      setRestTime(60);
      try { navigator.vibrate?.(200); } catch {}
      return;
    }
    const t = setTimeout(() => setRestTime(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [isResting, restTime, phase]);

  const handleSetDone = () => {
    if (currentSet < totalSets) {
      setCurrentSet(s => s + 1);
      setIsResting(true);
      setJustFinishedExercise(false);
      setRestTime(parseInt(currentExercise.rest) || 60);
    } else {
      setDoneExercises(prev => [...prev, currentExIdx]);
      if (currentExIdx < currentExercises.length - 1) {
        setCurrentExIdx(i => i + 1);
        setCurrentSet(1);
        setIsResting(true);
        setJustFinishedExercise(true);
        setRestTime(parseInt(currentExercise.rest) || 60);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    if (!currentSession.isRestDay) {
      const historyItem = {
        day: currentSession.day, 
        date: new Date().toISOString(), 
        sessionName: currentSessionDisplayName,
        sessionId: currentSession.id
      };
      
      const existingHistory = JSON.parse(localStorage.getItem("muscleup_history" + uidPrefix) || "[]");
      localStorage.setItem("muscleup_history" + uidPrefix, JSON.stringify([historyItem, ...existingHistory]));
      
      const existingDates = JSON.parse(localStorage.getItem("completedDates" + uidPrefix) || "[]");
      if (!existingDates.includes(todayStr)) {
        localStorage.setItem("completedDates" + uidPrefix, JSON.stringify([...existingDates, todayStr]));
      }
      
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#E24B4A', '#FFFFFF', '#1A1A1A'] 
      });
    }
    if (onFinish) onFinish(); else onBack();
  };

  if (phase === "select") {
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    const todayName = dayNamesFull[currentDayIdx];
    const todaySessionId = schedule ? schedule[todayName] : null;
    return (
      <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in fade-in duration-300">
        <header className="flex items-center gap-4 mb-10">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
          <h1 className="text-3xl font-headline text-white tracking-tight uppercase">Choisir une séance</h1>
        </header>
        <div className="space-y-4 flex-1 overflow-y-auto pb-10">
          {program.sessions.filter(s => !s.isRestDay).map((s) => {
            const isToday = s.id === todaySessionId;
            const sessionDisplayName = customNames[s.id] || s.name;
            const scheduledDays = schedule ? Object.entries(schedule).filter(([_, id]) => id === s.id).map(([day]) => day).join(' · ') : null;
            return (
              <button key={s.id} onClick={() => { setInternalSessionId(s.id); setPhase("intro"); }}
                className={cn("w-full p-6 bg-[#1A1A1A] border rounded-2xl text-left transition-all hover:border-primary/50 group", isToday ? "border-primary/40 bg-primary/5" : "border-[#2A2A2A]")}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <div className="font-headline text-2xl text-white uppercase group-hover:text-primary transition-colors leading-none">{sessionDisplayName}</div>
                    {scheduledDays && <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Prévu le {scheduledDays}</span>}
                  </div>
                  {isToday && <span className="bg-primary text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter shrink-0">AUJOURD'HUI</span>}
                </div>
                <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {s.exercises.length} exercices</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="text-[#EE3BAA]">{s.exercises[0]?.muscle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in fade-in duration-300">
        <button onClick={() => setPhase("select")} className="p-2 -ml-2 text-zinc-400 hover:text-white mb-8 w-fit"><ChevronLeft className="w-6 h-6" /></button>
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{program.emoji}</div>
            <h1 className="text-4xl font-headline text-white uppercase leading-tight mb-2">{currentSessionDisplayName}</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Mode {profile.location === 'maison' ? '🏠 Maison' : '🏋️ Salle'} • {currentSession.duration}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-[#2A2A2A]">
              <div className="text-2xl font-headline text-[#E24B4A]">{currentExercises.length}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Exercices</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-[#2A2A2A]">
              <div className="text-2xl font-headline text-[#E24B4A]">{currentSession.duration.replace(' min','')}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Minutes</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-[#2A2A2A]">
              <div className="text-2xl font-headline text-[#E24B4A]">60s</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Repos</div>
            </div>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pb-4">
            {currentExercises.map((ex, i) => {
              const suggested = getSuggestedWeight(ex, profile);
              return (
                <button key={i} onClick={() => setSelectedExercise(ex)}
                  className="w-full bg-[#1A1A1A] rounded-xl p-3 flex items-center gap-3 border border-[#2A2A2A] hover:border-[#E24B4A]/40 transition-all text-left active:scale-[0.98]">
                  <div className="w-7 h-7 rounded-full bg-[#E24B4A]/10 flex items-center justify-center text-[#E24B4A] font-headline text-sm flex-shrink-0">{i+1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white uppercase">{ex.name}</p>
                    <p className="text-[10px] text-zinc-500">{ex.sets} × {ex.reps} • {ex.rest}{suggested ? ` • 🏋️ ${suggested}` : ''}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#EE3BAA] bg-[#EE3BAA]/10 px-2 py-0.5 rounded-md shrink-0">{ex.muscle}</span>
                </button>
              );
            })}
          </div>
        </div>
        <Button onClick={() => { setCountdown(10); setCurrentExIdx(0); setCurrentSet(1); setDoneExercises([]); setIsResting(false); setPhase("countdown"); }}
          className="w-full h-14 bg-[#E24B4A] text-white font-headline text-2xl rounded-xl mt-4 flex items-center justify-center gap-3 press-effect ripple">
          <Play className="w-6 h-6" /> LANCER LA SÉANCE
        </Button>
        {selectedExercise && <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} profile={profile} />}
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0F0F0F] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <button onClick={() => setPhase("intro")} className="absolute top-6 right-6 text-zinc-500 p-2"><X className="w-6 h-6" /></button>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">La séance commence dans</p>
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#1A1A1A" strokeWidth="6" fill="transparent"/>
            <circle cx="50" cy="50" r="45" stroke="#E24B4A" strokeWidth="6" fill="transparent"
              strokeDasharray={283} strokeDashoffset={283 * (1 - countdown / 10)} className="transition-all duration-1000"/>
          </svg>
          <span className="text-8xl font-headline text-white">{countdown}</span>
        </div>
        <h2 className="text-2xl font-headline text-white uppercase">{currentSessionDisplayName}</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">{currentExercises.length} exercices</p>
        <button onClick={() => setPhase("workout")} className="mt-10 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
          Démarrer maintenant →
        </button>
      </div>
    );
  }

  const suggestedWeightCurrent = currentExercise ? getSuggestedWeight(currentExercise, profile) : null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F0F0F] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
      {/* Header progress */}
      <div className="p-4 flex items-center gap-4 shrink-0">
        <button onClick={() => setPhase("intro")} className="text-zinc-500 p-1"><X className="w-5 h-5" /></button>
        <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div className="h-full bg-[#E24B4A] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold text-zinc-500 shrink-0">{currentExIdx + 1}/{currentExercises.length}</span>
      </div>

      {isResting ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
            {justFinishedExercise ? "Exercice terminé ✓" : `Série ${currentSet - 1} / ${totalSets} terminée`}
          </p>
          <p className="text-white font-headline text-xl uppercase mb-8">
            {justFinishedExercise ? `Prochain : ${currentExercises[currentExIdx]?.name}` : `Prochain : Série ${currentSet} / ${totalSets}`}
          </p>
          <div className="relative w-44 h-44 flex items-center justify-center mb-8">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#1A1A1A" strokeWidth="5" fill="transparent"/>
              <circle cx="50" cy="50" r="44" stroke="#E24B4A" strokeWidth="5" fill="transparent"
                strokeDasharray={276} strokeDashoffset={276 * (1 - restTime / 60)} className="transition-all duration-1000"/>
            </svg>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-1 dumbbell-lift" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="10" width="3" height="4" rx="1" fill="#E24B4A"/>
                <rect x="4" y="8" width="2" height="8" rx="1" fill="#E24B4A"/>
                <rect x="6" y="11" width="12" height="2" rx="1" fill="#E24B4A"/>
                <rect x="18" y="8" width="2" height="8" rx="1" fill="#E24B4A"/>
                <rect x="20" y="10" width="3" height="4" rx="1" fill="#E24B4A"/>
              </svg>
              <span className="text-6xl font-headline text-white leading-none">{restTime}</span>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Repos</span>
            </div>
          </div>
          <button onClick={() => { setIsResting(false); setRestTime(60); }}
            className="text-zinc-400 font-bold text-sm uppercase tracking-widest border border-zinc-700 px-6 py-2.5 rounded-xl hover:text-white hover:border-zinc-500 transition-all">
            Passer le repos
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-4 pb-4 overflow-y-auto">
          <div className="text-center mb-2 shrink-0">
            <span className="text-[#E24B4A] font-bold text-[10px] uppercase tracking-widest">
              Exercice {currentExIdx + 1} / {currentExercises.length}
            </span>
            <h1 className="text-2xl font-headline text-white leading-tight uppercase">{currentExercise?.name}</h1>
            <div className="flex justify-center mt-1">
              <span className="px-3 py-0.5 bg-[#EE3BAA]/10 text-[#EE3BAA] text-[10px] font-bold uppercase rounded-md border border-[#EE3BAA]/20">
                {currentExercise?.muscle}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2 shrink-0">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-3 rounded-2xl text-center">
              <span className="text-3xl font-headline text-white block">{currentSet}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase">Série / {totalSets}</span>
            </div>
            <ExerciseAnimation muscle={currentExercise?.muscle || ''} />
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-3 rounded-2xl text-center">
              <span className="text-3xl font-headline text-white block">{currentExercise?.reps}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase">Reps</span>
            </div>
          </div>

          {suggestedWeightCurrent && (
            <div className="mx-auto mb-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 shrink-0">
              <span className="text-sm">🏋️</span>
              <span className="text-xs font-bold text-amber-400">Poids conseillé : {suggestedWeightCurrent}</span>
            </div>
          )}

          <p className="text-zinc-400 italic text-xs text-center max-w-xs mx-auto mb-2 shrink-0">
            "{currentExercise?.technique}"
          </p>

          <div className="bg-[#0F0F0F] border border-zinc-800 rounded-xl p-3 mb-2 shrink-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-[#E24B4A]"/>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Position</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">{currentExercise?.position}</p>
          </div>

          <button onClick={() => setSelectedExercise(currentExercise)}
            className="mx-auto flex items-center gap-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors mb-2 shrink-0">
            <Info className="w-3 h-3" /> Voir tout
          </button>

          <div className="shrink-0">
            <div className="flex justify-center gap-2 mb-2">
              {Array.from({ length: totalSets }).map((_, i) => (
                <div key={i} className={cn("w-2 h-2 rounded-full transition-all",
                  i < currentSet - 1 ? "bg-[#E24B4A]" : i === currentSet - 1 ? "bg-white" : "bg-zinc-700"
                )} />
              ))}
            </div>
            <Button onClick={handleSetDone} className="w-full h-14 rounded-3xl text-xl font-headline bg-[#E24B4A] text-white shadow-2xl press-effect ripple">
              SÉRIE {currentSet} TERMINÉE ✓
            </Button>
          </div>
        </div>
      )}

      {selectedExercise && <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} profile={profile} />}
    </div>
  );
}
