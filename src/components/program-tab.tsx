"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS, Exercise } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, Timer, Info, Zap, Play, Activity, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

function ExerciseAnimation({ muscle }: { muscle: string }) {
  const m = muscle.toLowerCase();
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#1A1A1A] rounded-xl border border-zinc-800 mb-4 mx-auto w-[180px] h-[180px] relative overflow-hidden">
      <svg width="140" height="140" viewBox="0 0 200 200" className="mx-auto">
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
        {(m.includes('jambe')||m.includes('quadri')||m.includes('ischio')||m.includes('fessier')||m.includes('mollet'))&&(<g><rect x="40" y="170" width="120" height="10" fill="#444" rx="5"/><g className="animate-squat"><circle cx="100" cy="40" r="15" fill="#444"/><path d="M100 55 L100 110" stroke="#444" strokeWidth="10" strokeLinecap="round"/><path d="M100 110 L80 170 M100 110 L120 170" stroke="#E24B4A" strokeWidth="10" strokeLinecap="round"/></g><path d="M150 150 L150 110 M140 125 L150 110 L160 125" fill="none" stroke="#E24B4A" strokeWidth="3" className="animate-arrow"/></g>)}
        {m.includes('abdo')&&(<g><rect x="40" y="140" width="120" height="10" fill="#444" rx="5"/><g className="animate-crunch"><path d="M100 140 L100 80" stroke="#E24B4A" strokeWidth="12" strokeLinecap="round"/><circle cx="100" cy="65" r="15" fill="#444"/></g><path d="M60 80 Q80 60 100 80" fill="none" stroke="#E24B4A" strokeWidth="3" strokeDasharray="5,5" className="animate-arrow"/></g>)}
        {!['bicep','avant-bras','tricep','pectoro','épaule','dos','dorsal','trapèze','jambe','quadri','ischio','fessier','mollet','abdo'].some(k=>m.includes(k))&&(<g opacity="0.5"><circle cx="100" cy="60" r="20" fill="#444"/><rect x="80" y="85" width="40" height="80" rx="10" fill="#444"/></g>)}
      </svg>
      <span className="absolute bottom-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Mouvement</span>
    </div>
  );
}

function ExerciseDetailModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loadingGif, setLoadingGif] = useState(true);

  useEffect(() => {
    const fetchGif = async () => {
      setLoadingGif(true);
      setGifUrl(null);
      try {
        const query = (exercise as any).nameEn || exercise.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const res = await fetch(`/api/exercise-gif?query=${encodeURIComponent(query)}`);
        const text = await res.text();
        console.log('status:', res.status, 'body:', text.substring(0, 200));
        const data = JSON.parse(text);
        if (data.gifUrl) setGifUrl(data.gifUrl);
      } catch (e) {
        console.error('fetch error:', e);
      } finally {
        setLoadingGif(false);
      }
    };
    fetchGif();
  }, [exercise.name]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-[#1A1A1A] rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { e.currentTarget.dataset.touchY = String(e.touches[0].clientY); }}
        onTouchEnd={e => {
          const delta = e.changedTouches[0].clientY - Number(e.currentTarget.dataset.touchY);
          if (delta > 80) onClose();
        }}>
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
          <ExerciseAnimation muscle={exercise.muscle} />
        )}

        <h2 className="text-3xl font-headline text-[#E24B4A] uppercase text-center mb-3">{exercise.name}</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          <span className="px-3 py-1 bg-[#EE3BAA]/10 text-[#EE3BAA] text-[11px] font-bold uppercase rounded-md border border-[#EE3BAA]/20">{exercise.muscle}</span>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase rounded-md">{exercise.sets} × {exercise.reps}</span>
          <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase rounded-md flex items-center gap-1"><Timer className="w-3 h-3"/> {exercise.rest}</span>
        </div>
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
        <Button onClick={onClose} className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-headline text-lg rounded-xl">FERMER</Button>
      </div>
    </div>
  );
}

type ProgramTabProps = {
  profile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  manualSessionId?: string | null;
};

export default function ProgramTab({ profile, onBack, onUpdateProfile, manualSessionId }: ProgramTabProps) {
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

  useEffect(() => {
    const savedNames = localStorage.getItem("muscleup_session_names");
    if (savedNames) setCustomNames(JSON.parse(savedNames));
  }, []);

  const schedule = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved) as Record<string, string | null>;
    return null;
  }, []);

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
    const todayStr = new Date().toISOString().split('T')[0];
    const historyItem = { day: currentSession.day, date: new Date().toISOString(), sessionName: currentSessionDisplayName };
    const existingHistory = JSON.parse(localStorage.getItem("muscleup_history") || "[]");
    localStorage.setItem("muscleup_history", JSON.stringify([historyItem, ...existingHistory]));
    const existingDates = JSON.parse(localStorage.getItem("completedDates") || "[]");
    if (!existingDates.includes(todayStr)) localStorage.setItem("completedDates", JSON.stringify([...existingDates, todayStr]));
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#E24B4A', '#FFFFFF', '#1A1A1A'] });
    onBack();
  };

  if (phase === "select") {
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    const todayName = dayNamesFull[currentDayIdx];
    const todaySessionId = schedule ? schedule[todayName] : null;

    return (
      <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in fade-in duration-300">
        <header className="flex items-center gap-4 mb-10">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-headline text-white tracking-tight uppercase">Choisir une séance</h1>
        </header>
        <div className="space-y-4 flex-1 overflow-y-auto pb-10">
          {program.sessions.filter(s => !s.isRestDay).map((s) => {
            const isToday = s.id === todaySessionId;
            const sessionDisplayName = customNames[s.id] || s.name;
            const scheduledDays = schedule
              ? Object.entries(schedule).filter(([_, id]) => id === s.id).map(([day]) => day).join(' · ')
              : null;
            return (
              <button key={s.id}
                onClick={() => { setInternalSessionId(s.id); setPhase("intro"); }}
                className={cn("w-full p-6 bg-[#1A1A1A] border rounded-2xl text-left transition-all hover:border-primary/50 group",
                  isToday ? "border-primary/40 bg-primary/5 shadow-2xl shadow-primary/5" : "border-[#2A2A2A]")}>
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
        <button onClick={() => setPhase("select")} className="p-2 -ml-2 text-zinc-400 hover:text-white mb-8 w-fit">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{program.emoji}</div>
            <h1 className="text-4xl font-headline text-white uppercase leading-tight mb-2">{currentSessionDisplayName}</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Mode {profile.location === 'maison' ? '🏠 Maison' : '🏋️ Salle'} • {currentSession.duration}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2A2A2A]">
              <div className="text-2xl font-headline text-[#E24B4A]">{currentExercises.length}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Exercices</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2A2A2A]">
              <div className="text-2xl font-headline text-[#E24B4A]">{currentSession.duration.replace(' min','')}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Minutes</div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#2A2A2A]">
              <div className="text-2xl font-headline text-[#E24B4A]">60s</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Repos</div>
            </div>
          </div>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">
            Appuie sur un exercice pour voir les détails
          </p>
          <div className="space-y-3 flex-1 overflow-y-auto pb-4">
            {currentExercises.map((ex, i) => (
              <button key={i} onClick={() => setSelectedExercise(ex)}
                className="w-full bg-[#1A1A1A] rounded-xl p-3 flex items-center gap-3 border border-[#2A2A2A] hover:border-[#E24B4A]/40 transition-all text-left active:scale-[0.98]">
                <div className="w-7 h-7 rounded-full bg-[#E24B4A]/10 flex items-center justify-center text-[#E24B4A] font-headline text-sm flex-shrink-0">{i+1}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white uppercase">{ex.name}</p>
                  <p className="text-[10px] text-zinc-500">{ex.sets} × {ex.reps} • {ex.rest} repos</p>
                </div>
                <span className="text-[10px] font-bold text-[#EE3BAA] bg-[#EE3BAA]/10 px-2 py-0.5 rounded-md shrink-0">{ex.muscle}</span>
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={() => { setCountdown(10); setCurrentExIdx(0); setCurrentSet(1); setDoneExercises([]); setIsResting(false); setPhase("countdown"); }}
          className="w-full h-16 bg-[#E24B4A] text-white font-headline text-2xl rounded-xl mt-6 flex items-center justify-center gap-3">
          <Play className="w-6 h-6" />
          LANCER LA SÉANCE
        </Button>
        {selectedExercise && <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0F0F0F] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <button onClick={() => setPhase("intro")} className="absolute top-6 right-6 text-zinc-500 p-2">
          <X className="w-6 h-6" />
        </button>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">La séance commence dans</p>
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#1A1A1A" strokeWidth="6" fill="transparent"/>
            <circle cx="50" cy="50" r="45" stroke="#E24B4A" strokeWidth="6" fill="transparent"
              strokeDasharray={283} strokeDashoffset={283 * (1 - countdown / 10)}
              className="transition-all duration-1000"/>
          </svg>
          <span className="text-8xl font-headline text-white">{countdown}</span>
        </div>
        <h2 className="text-2xl font-headline text-white uppercase">{currentSessionDisplayName}</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">{currentExercises.length} exercices</p>
        <button onClick={() => setPhase("workout")}
          className="mt-10 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
          Démarrer maintenant →
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F0F0F] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => setPhase("intro")} className="text-zinc-500 p-1">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div className="h-full bg-[#E24B4A] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold text-zinc-500 shrink-0">{currentExIdx + 1}/{currentExercises.length}</span>
      </div>

      {isResting ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
            {justFinishedExercise ? "Exercice terminé ✓" : `Série ${currentSet - 1} / ${totalSets} terminée`}
          </p>
          <p className="text-white font-headline text-xl uppercase mb-10">
            {justFinishedExercise
              ? `Prochain : ${currentExercises[currentExIdx]?.name}`
              : `Prochain : Série ${currentSet} / ${totalSets}`}
          </p>
          <div className="relative w-52 h-52 flex items-center justify-center mb-10">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#1A1A1A" strokeWidth="5" fill="transparent"/>
              <circle cx="50" cy="50" r="44" stroke="#E24B4A" strokeWidth="5" fill="transparent"
                strokeDasharray={276} strokeDashoffset={276 * (1 - restTime / 60)}
                className="transition-all duration-1000"/>
            </svg>
            <div className="flex flex-col items-center">
              <Timer className="w-8 h-8 text-[#E24B4A] mb-1" />
              <span className="text-7xl font-headline text-white leading-none">{restTime}</span>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Repos</span>
            </div>
          </div>
          <button onClick={() => { setIsResting(false); setRestTime(60); }}
            className="text-zinc-400 font-bold text-sm uppercase tracking-widest border border-zinc-700 px-6 py-3 rounded-xl hover:text-white hover:border-zinc-500 transition-all">
            Passer le repos
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[#E24B4A] font-bold text-xs uppercase tracking-widest mb-2 text-center">
              Exercice {currentExIdx + 1} / {currentExercises.length}
            </span>
            <h1 className="text-4xl font-headline text-white mb-2 leading-tight uppercase text-center">
              {currentExercise?.name}
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8 text-center">
              {currentExercise?.muscle}
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] px-8 py-5 rounded-2xl text-center">
                <span className="text-5xl font-headline text-white block">{currentSet}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Série</span>
                <span className="text-[10px] font-bold text-zinc-700 block">/ {totalSets}</span>
              </div>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] px-8 py-5 rounded-2xl text-center">
                <span className="text-5xl font-headline text-white block">{currentExercise?.reps}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Reps</span>
              </div>
            </div>
            <p className="text-zinc-400 italic text-sm text-center max-w-xs mx-auto mb-6">
              "{currentExercise?.technique}"
            </p>
            <button onClick={() => setSelectedExercise(currentExercise)}
              className="mx-auto flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors border border-zinc-800 px-4 py-2 rounded-lg">
              <Info className="w-3 h-3" /> Voir le mouvement
            </button>
          </div>
          <div className="pb-6 space-y-3">
            <div className="flex justify-center gap-2 mb-2">
              {Array.from({ length: totalSets }).map((_, i) => (
                <div key={i} className={cn("w-2 h-2 rounded-full transition-all",
                  i < currentSet - 1 ? "bg-[#E24B4A]" : i === currentSet - 1 ? "bg-white" : "bg-zinc-700"
                )} />
              ))}
            </div>
            <Button onClick={handleSetDone}
              className="w-full h-20 rounded-3xl text-2xl font-headline bg-[#E24B4A] text-white shadow-2xl">
              SÉRIE {currentSet} TERMINÉE ✓
            </Button>
          </div>
        </div>
      )}

      {selectedExercise && <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
    </div>
  );
}