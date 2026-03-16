
"use client";

import { useState, useEffect } from "react";
import { Session, Exercise } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, CheckCircle2, Timer, Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type ActiveSessionProps = {
  session: Session;
  onClose: () => void;
  onFinish: () => void;
};

export default function ActiveSession({ session, onClose, onFinish }: ActiveSessionProps) {
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentExercise = session.exercises[currentExIdx];
  const totalExercises = session.exercises.length;
  const totalSets = parseInt(currentExercise.sets);

  useEffect(() => {
    let interval: any;
    if (isResting && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      setIsResting(false);
      setTimeLeft(60);
      // On pourrait ajouter un son ici
    }
    return () => clearInterval(interval);
  }, [isResting, isTimerRunning, timeLeft]);

  const handleNextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setIsTimerRunning(true);
    } else {
      if (currentExIdx < totalExercises - 1) {
        setCurrentExIdx(currentExIdx + 1);
        setCurrentSet(1);
        setIsResting(false);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E24B4A', '#EE3BAA', '#FFFFFF']
    });
    onFinish();
  };

  const progress = ((currentExIdx + (currentSet / totalSets)) / totalExercises) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onClose} className="p-2 -ml-2 text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 px-4">
          <Progress value={progress} className="h-2 bg-zinc-800" />
          <p className="text-[10px] text-center mt-2 font-bold uppercase tracking-widest text-muted-foreground">
            Exercice {currentExIdx + 1} / {totalExercises}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {!isResting ? (
        <div className="flex-1 flex flex-col fade-in">
          <div className="flex-1">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase mb-2">
                {currentExercise.muscle}
              </span>
              <h1 className="text-4xl font-headline text-white mb-2 leading-tight">{currentExercise.name}</h1>
              <div className="flex gap-4">
                <div className="bg-secondary px-4 py-2 rounded-2xl">
                  <span className="text-2xl font-headline text-white">{currentExercise.sets}</span>
                  <span className="text-[10px] ml-1 font-bold text-muted-foreground uppercase">Séries</span>
                </div>
                <div className="bg-secondary px-4 py-2 rounded-2xl">
                  <span className="text-2xl font-headline text-white">{currentExercise.reps}</span>
                  <span className="text-[10px] ml-1 font-bold text-muted-foreground uppercase">Reps</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-3xl border border-zinc-800 mb-8">
              <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Conseil Technique
              </h2>
              <p className="text-lg leading-relaxed text-zinc-300 italic">
                "{currentExercise.technique}"
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: totalSets }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    i + 1 < currentSet ? "bg-green-500" : i + 1 === currentSet ? "bg-primary scale-125 shadow-[0_0_10px_rgba(226,75,74,0.5)]" : "bg-zinc-800"
                  )}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={handleNextSet}
            className="w-full h-16 rounded-2xl text-xl font-headline bg-primary hover:bg-primary/90"
          >
            SÉRIE {currentSet} TERMINÉE
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center fade-in">
          <div className="relative w-64 h-64 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-800"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={753}
                  strokeDashoffset={753 - (753 * timeLeft) / 60}
                  className="text-primary transition-all duration-1000"
                />
             </svg>
             <div className="absolute flex flex-col items-center">
                <Timer className="w-8 h-8 text-primary mb-2" />
                <span className="text-7xl font-headline text-white">{timeLeft}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Repos</span>
             </div>
          </div>

          <div className="flex gap-4 mt-12">
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white"
            >
              {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button 
              onClick={() => setTimeLeft(60)}
              className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => setIsResting(false)}
            className="mt-12 text-muted-foreground uppercase font-bold tracking-widest hover:text-white"
          >
            Passer le repos
          </Button>
        </div>
      )}
    </div>
  );
}
