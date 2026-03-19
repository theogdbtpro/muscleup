
"use client";

import { useState, useEffect, useMemo } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS, Exercise } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, Timer, Info, X, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { searchExerciseGif } from "@/services/exercisedb";

function ExerciseDiagram({ muscle }: { muscle: string }) {
  const m = muscle.toLowerCase();
  
  // Déterminer si on affiche la silhouette de face ou de dos
  const isBackView = m.includes('dos') || m.includes('trapèze') || m.includes('ischio') || m.includes('fessier') || m.includes('triceps') || m.includes('mollet');

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#0F0F0F] rounded-2xl border border-zinc-800/50 mb-6 mx-auto w-fit">
      <svg width="120" height="180" viewBox="0 0 200 300" className="mx-auto">
        {/* Silhouette de base - Corps Simplifié */}
        <g stroke="#2A2A2A" strokeWidth="2" fill="none">
          {/* Tête */}
          <circle cx="100" cy="40" r="15" />
          {/* Cou */}
          <path d="M95 55 L105 55" />
          {/* Torse */}
          <path d="M70 65 L130 65 L120 160 L80 160 Z" />
          {/* Bras Gauche */}
          <path d="M70 65 L50 140" />
          {/* Bras Droit */}
          <path d="M130 65 L150 140" />
          {/* Jambes */}
          <path d="M85 160 L75 280" />
          <path d="M115 160 L125 280" />
        </g>

        {/* Zones Musculaires - Mise en évidence */}
        <g fill="#E24B4A" opacity="0.8">
          {/* Pectoraux (Face) */}
          {m.includes('pectoro') && !isBackView && (
            <path d="M75 75 Q100 70 125 75 L120 105 Q100 110 80 105 Z" />
          )}
          
          {/* Biceps (Face) */}
          {(m.includes('bicep') || m.includes('avant-bras')) && !isBackView && (
            <>
              <ellipse cx="60" cy="100" rx="8" ry="15" transform="rotate(-15 60 100)" />
              <ellipse cx="140" cy="100" rx="8" ry="15" transform="rotate(15 140 100)" />
            </>
          )}

          {/* Abdos (Face) */}
          {(m.includes('abdo') || m.includes('oblique') || m.includes('transverse')) && !isBackView && (
            <rect x="85" y="115" width="30" height="40" rx="5" />
          )}

          {/* Quadriceps (Face) */}
          {m.includes('quadri') && !isBackView && (
            <>
              <path d="M85 170 L78 230 L95 230 L100 170 Z" />
              <path d="M115 170 L122 230 L105 230 L100 170 Z" />
            </>
          )}

          {/* Épaules (Face/Dos) */}
          {m.includes('épaule') && (
            <>
              <circle cx="70" cy="70" r="10" />
              <circle cx="130" cy="70" r="10" />
            </>
          )}

          {/* Dos & Trapèzes (Dos) */}
          {(m.includes('dos') || m.includes('trapèze')) && isBackView && (
            <path d="M75 70 L125 70 L120 155 L80 155 Z" />
          )}

          {/* Triceps (Dos) */}
          {m.includes('tricep') && isBackView && (
            <>
              <ellipse cx="60" cy="100" rx="7" ry="14" transform="rotate(-15 60 100)" />
              <ellipse cx="140" cy="100" rx="7" ry="14" transform="rotate(15 140 100)" />
            </>
          )}

          {/* Fessiers & Ischios (Dos) */}
          {(m.includes('ischio') || m.includes('fessier')) && isBackView && (
            <>
              <path d="M80 160 L120 160 L115 190 L85 190 Z" /> {/* Fessiers */}
              <path d="M85 195 L78 245 L95 245 L98 195 Z" />   {/* Ischio G */}
              <path d="M115 195 L122 245 L105 245 L102 195 Z" /> {/* Ischio D */}
            </>
          )}

          {/* Mollets (Dos/Profil) */}
          {m.includes('mollet') && (
            <>
              <ellipse cx="78" cy="255" rx="6" ry="12" />
              <ellipse cx="122" cy="255" rx="6" ry="12" />
            </>
          )}
        </g>
      </svg>
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
        Vue {isBackView ? 'Postérieure' : 'Antérieure'}
      </span>
    </div>
  );
}

export default function ProgramTab({ profile, onBack, onUpdateProfile, manualSessionId }: ProgramTabProps) {
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  
  const schedule = useMemo(() => {
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    return null;
  }, []);

  const currentSession = useMemo(() => {
    if (manualSessionId) {
      return program.sessions.find(s => s.id === manualSessionId) || program.sessions[0];
    }
    
    const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    const todayName = dayNamesFull[currentDayIdx];
    
    if (schedule && schedule[todayName]) {
      return program.sessions.find(s => s.id === schedule[todayName]) || program.sessions[0];
    }
    
    return program.sessions.find(s => s.day === todayName) || program.sessions[0];
  }, [program, manualSessionId, schedule]);

  const [checkedExercises, setCheckedExercises] = useState<number[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const progress = (checkedExercises.length / currentSession.exercises.length) * 100;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsResting(false);
      setTimeLeft(60);
    }
    return () => clearInterval(timer);
  }, [isResting, timeLeft]);

  useEffect(() => {
    if (selectedExercise) {
      setIsGifLoading(true);
      setGifUrl(null);
      searchExerciseGif(selectedExercise.englishName).then(url => {
        setGifUrl(url);
        setIsGifLoading(false);
      });
    }
  }, [selectedExercise]);

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
    
    const historyItem = {
      day: currentSession.day,
      date: new Date().toISOString(),
      sessionName: currentSession.name
    };
    const existingHistory = JSON.parse(localStorage.getItem("muscleup_history") || "[]");
    localStorage.setItem("muscleup_history", JSON.stringify([historyItem, ...existingHistory]));
    
    const existingDates = JSON.parse(localStorage.getItem("completedDates") || "[]");
    if (!existingDates.includes(todayStr)) {
      localStorage.setItem("completedDates", JSON.stringify([...existingDates, todayStr]));
    }
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E24B4A', '#FFFFFF', '#1A1A1A']
    });

    onBack();
  };

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-right">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Exercice</span>
          <span className="text-xl font-headline text-white">{checkedExercises.length} / {currentSession.exercises.length}</span>
        </div>
      </header>

      <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full mb-10 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isResting && (
        <div className="mb-8 p-6 bg-[#1A1A1A] rounded-2xl border border-primary/30 flex flex-col items-center animate-in zoom-in-95">
          <div className="relative w-24 h-24 flex items-center justify-center mb-2">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="48" cy="48" r="44"
                stroke="currentColor" strokeWidth="4"
                fill="transparent" className="text-zinc-800"
              />
              <circle
                cx="48" cy="48" r="44"
                stroke="currentColor" strokeWidth="4"
                fill="transparent" className="text-primary transition-all duration-1000"
                strokeDasharray={276}
                strokeDashoffset={276 * (1 - timeLeft / 60)}
              />
            </svg>
            <span className="text-3xl font-headline text-white">{timeLeft}s</span>
          </div>
          <button onClick={() => setIsResting(false)} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white">
            Ignorer le repos
          </button>
        </div>
      )}

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-10">
        <h2 className="text-4xl font-headline text-white mb-6 leading-none uppercase">
          {currentSession.name}
        </h2>
        
        {currentSession.exercises.map((ex, idx) => {
          const isChecked = checkedExercises.includes(idx);
          return (
            <div 
              key={idx} 
              className={cn(
                "p-5 rounded-2xl border transition-all flex items-center gap-5",
                isChecked ? "bg-primary/5 border-primary/30" : "bg-[#1A1A1A] border-transparent"
              )}
            >
              <div 
                onClick={() => toggleExercise(idx)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer",
                  isChecked ? "bg-primary border-primary text-white" : "border-[#2A2A2A] text-zinc-600"
                )}>
                {isChecked ? <Check className="w-5 h-5" /> : <span className="font-bold text-xs">{idx + 1}</span>}
              </div>
              
              <div className="flex-1 cursor-pointer" onClick={() => setSelectedExercise(ex)}>
                <h3 className={cn("font-bold text-sm transition-colors uppercase tracking-tight", isChecked ? "text-white" : "text-zinc-400")}>
                  {ex.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                    {ex.sets} séries × {ex.reps}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-700">
                    <Timer className="w-3 h-3" />
                    <span>{ex.rest}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedExercise(ex)} className="p-2 text-zinc-700 hover:text-white">
                <Info className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F] to-transparent">
        <div className="space-y-3">
          <Button
            onClick={handleFinish}
            disabled={checkedExercises.length === 0}
            className="w-full h-14 rounded-xl text-xl font-headline bg-primary text-white shadow-xl shadow-primary/20"
          >
            TERMINER LA SÉANCE
          </Button>
          <button 
            onClick={handleFinish}
            className="w-full text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400"
          >
            Terminer quand même →
          </button>
        </div>
      </div>

      {selectedExercise && (
        <div 
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 animate-in fade-in duration-300"
          onClick={() => setSelectedExercise(null)}
        >
          <div 
            className="w-full max-w-[430px] bg-[#1A1A1A] rounded-t-[30px] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />
            
            {/* GIF Preview */}
            <div className="flex justify-center mb-6">
              {isGifLoading ? (
                <div className="w-[200px] h-[200px] bg-zinc-800 rounded-xl flex flex-col items-center justify-center animate-pulse border border-zinc-700">
                  <Loader2 className="w-8 h-8 text-zinc-600 animate-spin mb-2" />
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Chargement...</span>
                </div>
              ) : gifUrl ? (
                <img 
                  src={gifUrl} 
                  alt={selectedExercise.name} 
                  className="w-[200px] h-[200px] rounded-xl object-cover border border-zinc-800 shadow-2xl shadow-black" 
                />
              ) : (
                <div className="w-[200px] h-[200px] bg-zinc-900/50 rounded-xl flex flex-col items-center justify-center border border-zinc-800">
                  <Info className="w-8 h-8 text-zinc-800 mb-2" />
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center px-4">Aperçu non disponible</span>
                </div>
              )}
            </div>

            <ExerciseDiagram muscle={selectedExercise.muscle} />

            <header className="mb-8 text-center">
              <h2 className="text-4xl font-headline text-primary uppercase leading-none mb-3">
                {selectedExercise.name}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-[#EE3BAA]/10 text-[#EE3BAA] text-[10px] font-bold uppercase rounded-md border border-[#EE3BAA]/20">
                  {selectedExercise.muscle}
                </span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase rounded-md">
                  {selectedExercise.sets} Séries × {selectedExercise.reps}
                </span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                  <Timer className="w-3 h-3" /> {selectedExercise.rest}
                </span>
              </div>
            </header>

            <div className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Position & Mouvement</h3>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed bg-[#0F0F0F] p-5 rounded-2xl border border-zinc-800/50">
                  {selectedExercise.position}
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#EE3BAA]" />
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Conseil technique</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-[#EE3BAA] pl-4">
                  "{selectedExercise.technique}"
                </p>
              </section>

              <Button 
                onClick={() => setSelectedExercise(null)}
                className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-headline text-xl rounded-xl transition-colors"
              >
                FERMER
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
