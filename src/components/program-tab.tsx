"use client";

import { useState, useEffect, useMemo } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS, Exercise } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, Timer, Info, Zap, Play, Activity, Clock } from "lucide-react";
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

type ProgramTabProps = {
  profile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
  manualSessionId?: string | null;
};

export default function ProgramTab({ profile, onBack, onUpdateProfile, manualSessionId }: ProgramTabProps) {
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  
  const [internalSessionId, setInternalSessionId] = useState<string | null>(manualSessionId || null);
  const [phase, setPhase] = useState<"select" | "intro" | "workout">(manualSessionId ? "intro" : "select");

  const schedule = useMemo(() => {
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    return null;
  }, []);

  const currentSession = useMemo(() => {
    if (internalSessionId) return program.sessions.find(s => s.id === internalSessionId) || program.sessions[0];
    
    // Fallback based on schedule if no internalSessionId is set (only for initial detection)
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    const todayName = dayNamesFull[currentDayIdx];
    if (schedule && schedule[todayName]) return program.sessions.find(s => s.id === schedule[todayName]) || program.sessions[0];
    return program.sessions.find(s => s.day === todayName) || program.sessions[0];
  }, [program, internalSessionId, schedule]);

  const currentExercises = useMemo(() => {
    if (profile.location === 'maison' && currentSession.homeExercises) {
      return currentSession.homeExercises;
    }
    return currentSession.exercises;
  }, [profile.location, currentSession]);

  const [checkedExercises, setCheckedExercises] = useState<number[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [readyMessage, setReadyMessage] = useState(false);

  const progress = (checkedExercises.length / currentExercises.length) * 100;
  const allDone = checkedExercises.length === currentExercises.length;

  useEffect(() => {
    if (phase !== "workout") return;
    let timer: NodeJS.Timeout;
    if (isResting && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isResting && timeLeft === 0) {
      setIsResting(false);
      setTimeLeft(60);
      try { navigator.vibrate?.(200); } catch {}
      setReadyMessage(true);
      setTimeout(() => setReadyMessage(false), 1500);
    }
    return () => clearInterval(timer);
  }, [isResting, timeLeft, phase]);

  const toggleExercise = (idx: number) => {
    if (checkedExercises.includes(idx)) {
      setCheckedExercises(checkedExercises.filter(i => i !== idx));
    } else {
      setCheckedExercises([...checkedExercises, idx]);
      setIsResting(true);
      setTimeLeft(60);
    }
  };

  const handleFinish = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const historyItem = { day: currentSession.day, date: new Date().toISOString(), sessionName: currentSession.name };
    const existingHistory = JSON.parse(localStorage.getItem("muscleup_history") || "[]");
    localStorage.setItem("muscleup_history", JSON.stringify([historyItem, ...existingHistory]));
    const existingDates = JSON.parse(localStorage.getItem("completedDates") || "[]");
    if (!existingDates.includes(todayStr)) localStorage.setItem("completedDates", JSON.stringify([...existingDates, todayStr]));
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#E24B4A', '#FFFFFF', '#1A1A1A'] });
    onBack();
  };

  // PHASE SELECT
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
          <h1 className="text-3xl font-headline text-white tracking-tight uppercase">CHOISIR UNE SÉANCE</h1>
        </header>

        <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-10">
          {program.sessions.filter(s => !s.isRestDay).map((s) => {
            const isToday = s.id === todaySessionId;
            return (
              <button 
                key={s.id} 
                onClick={() => { setInternalSessionId(s.id); setPhase("intro"); }}
                className={cn(
                  "w-full p-6 bg-[#1A1A1A] border rounded-2xl text-left transition-all hover:border-primary/50 group",
                  isToday ? "border-primary/40 bg-primary/5 shadow-2xl shadow-primary/5" : "border-[#2A2A2A]"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-headline text-2xl text-white uppercase group-hover:text-primary transition-colors leading-none">{s.name}</div>
                  {isToday && (
                    <span className="bg-primary text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">
                      AUJOURD'HUI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {s.exercises.length} EXERCICES</span>
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

  // PHASE INTRO
  if (phase === "intro") {
    return (
      <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in fade-in duration-300">
        <button onClick={() => setPhase("select")} className="p-2 -ml-2 text-zinc-400 hover:text-white mb-8 w-fit">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">{program.emoji}</div>
            <h1 className="text-4xl font-headline text-white uppercase leading-tight mb-2">{currentSession.name}</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Mode {profile.location === 'maison' ? '🏠 Maison' : '🏋️ Salle'} • {currentSession.duration}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-12">
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
          <div className="space-y-3">
            {currentExercises.map((ex, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-xl p-3 flex items-center gap-3 border border-[#2A2A2A]">
                <div className="w-7 h-7 rounded-full bg-[#E24B4A]/10 flex items-center justify-center text-[#E24B4A] font-headline text-sm flex-shrink-0">{i+1}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white uppercase">{ex.name}</p>
                  <p className="text-[10px] text-zinc-500">{ex.sets} × {ex.reps}</p>
                </div>
                <span className="text-[10px] font-bold text-[#EE3BAA] bg-[#EE3BAA]/10 px-2 py-0.5 rounded-md">{ex.muscle}</span>
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={() => setPhase("workout")}
          className="w-full h-16 bg-[#E24B4A] text-white font-headline text-2xl rounded-xl mt-6 flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6" />
          LANCER LA SÉANCE
        </Button>
      </div>
    );
  }

  // PHASE WORKOUT
  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-5 animate-in fade-in duration-300">
      <header className="flex items-center justify-between mb-5">
        <button onClick={() => setPhase("intro")} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-right">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">Progression</span>
          <span className="text-2xl font-headline text-white">{checkedExercises.length}/{currentExercises.length}</span>
        </div>
      </header>

      <div className="w-full h-2 bg-[#1A1A1A] rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-[#E24B4A] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="text-2xl font-headline text-white mb-1 uppercase">{currentSession.name}</h2>
      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-5">Clique sur un exercice pour voir le mouvement</p>

      {readyMessage && (
        <div className="mb-4 p-4 bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-2xl text-center">
          <p className="text-[#4CAF50] font-headline text-xl">C'EST REPARTI ! 💪</p>
        </div>
      )}

      {isResting && !readyMessage && (
        <div className="mb-4 p-4 bg-[#1A1A1A] rounded-2xl border border-[#E24B4A]/30 flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="#2A2A2A" strokeWidth="3" fill="transparent"/>
              <circle cx="28" cy="28" r="24" stroke="#E24B4A" strokeWidth="3" fill="transparent" strokeDasharray={150} strokeDashoffset={150*(1-timeLeft/60)}/>
            </svg>
            <span className="text-lg font-headline text-white">{timeLeft}s</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Repos en cours</p>
            <p className="text-xs text-zinc-500 mt-0.5">Récupère avant la prochaine série</p>
          </div>
          <button onClick={() => setIsResting(false)} className="text-[10px] font-bold text-[#E24B4A] uppercase border border-[#E24B4A]/40 px-3 py-2 rounded-lg">
            Ignorer
          </button>
        </div>
      )}

      <div className="space-y-3 flex-1 pb-6 overflow-y-auto no-scrollbar">
        {currentExercises.map((ex, idx) => {
          const isChecked = checkedExercises.includes(idx);
          return (
            <div key={idx}
              className={cn("rounded-2xl border transition-all cursor-pointer active:scale-[0.98]",
                isChecked ? "bg-[#E24B4A]/8 border-[#E24B4A]/40" : "bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#E24B4A]/30")}
              onClick={() => setSelectedExercise(ex)}
            >
              <div className="p-4 flex items-center gap-4">
                <button onClick={e => { e.stopPropagation(); toggleExercise(idx); }}
                  className={cn("w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0",
                    isChecked ? "bg-[#E24B4A] border-[#E24B4A] text-white" : "border-[#444] text-zinc-400 bg-[#0F0F0F]")}>
                  {isChecked ? <Check className="w-5 h-5"/> : <span className="font-headline text-base">{idx+1}</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={cn("font-bold text-base uppercase tracking-tight", isChecked ? "text-zinc-500 line-through" : "text-white")}>{ex.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 bg-[#0F0F0F] px-2 py-0.5 rounded-md">{ex.sets} × {ex.reps}</span>
                    <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1"><Timer className="w-3 h-3"/>{ex.rest}</span>
                    <span className="text-[11px] font-bold text-[#EE3BAA] bg-[#EE3BAA]/10 px-2 py-0.5 rounded-md">{ex.muscle}</span>
                  </div>
                </div>
                <div className={cn("text-xs font-bold flex-shrink-0", isChecked ? "text-[#E24B4A]" : "text-zinc-600")}>
                  {isChecked ? "✓" : "›"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pb-6">
        <Button onClick={handleFinish} disabled={checkedExercises.length === 0}
          className={cn("w-full h-14 rounded-xl text-xl font-headline transition-all duration-300",
            allDone ? "bg-[#4CAF50] hover:bg-[#43A047] text-white shadow-xl"
              : "bg-[#E24B4A] hover:bg-[#D43F3F] text-white shadow-xl disabled:opacity-30")}>
          {allDone ? "VALIDER LA SÉANCE ✓" : checkedExercises.length === 0 ? "COCHE TES EXERCICES" : `TERMINER (${checkedExercises.length}/${currentExercises.length})`}
        </Button>
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80" onClick={() => setSelectedExercise(null)}>
          <div className="w-full max-w-[430px] bg-[#1A1A1A] rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />
            <ExerciseAnimation muscle={selectedExercise.muscle} />
            <h2 className="text-3xl font-headline text-[#E24B4A] uppercase text-center mb-3">{selectedExercise.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              <span className="px-3 py-1 bg-[#EE3BAA]/10 text-[#EE3BAA] text-[11px] font-bold uppercase rounded-md border border-[#EE3BAA]/20">{selectedExercise.muscle}</span>
              <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase rounded-md">{selectedExercise.sets} × {selectedExercise.reps}</span>
              <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase rounded-md flex items-center gap-1"><Timer className="w-3 h-3"/> {selectedExercise.rest}</span>
            </div>
            <div className="space-y-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-[#E24B4A]"/><span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Position & Mouvement</span></div>
                <p className="text-sm text-zinc-200 leading-relaxed bg-[#0F0F0F] p-4 rounded-xl border border-zinc-800">{selectedExercise.position}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-[#EE3BAA]"/><span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Conseil technique</span></div>
                <p className="text-sm text-zinc-300 italic border-l-2 border-[#EE3BAA] pl-4 leading-relaxed">"{selectedExercise.technique}"</p>
              </div>
            </div>
            <Button onClick={() => setSelectedExercise(null)} className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-headline text-lg rounded-xl">FERMER</Button>
          </div>
        </div>
      )}
    </div>
  );
}
