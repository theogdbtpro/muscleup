
"use client";

import { useState, useEffect } from "react";
import { Session } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Timer, ArrowRight, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const currentExercise = session.exercises[currentExIdx];
  const totalSets = parseInt(currentExercise.sets);
  const progress = ((currentExIdx + (currentSet / totalSets)) / session.exercises.length) * 100;

  useEffect(() => {
    let interval: any;
    if (isResting && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsResting(false);
      setTimeLeft(60);
    }
    return () => clearInterval(interval);
  }, [isResting, timeLeft]);

  const handleNext = () => {
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      setIsResting(true);
    } else {
      if (currentExIdx < session.exercises.length - 1) {
        setCurrentExIdx(currentExIdx + 1);
        setCurrentSet(1);
        setIsResting(false);
      } else {
        finish();
      }
    }
  };

  const finish = () => {
    const historyItem = {
      objective: session.day,
      day: session.day,
      date: new Date().toISOString(),
      exercises: session.exercises.length
    };
    const existing = JSON.parse(localStorage.getItem("muscleup_history") || "[]");
    localStorage.setItem("muscleup_history", JSON.stringify([historyItem, ...existing]));
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    onFinish();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
      <header className="p-6 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Progress value={progress} className="h-2 bg-zinc-800" />
        </div>
        <button onClick={onClose} className="text-zinc-500 p-2"><X className="w-6 h-6" /></button>
      </header>

      {!isResting ? (
        <div className="flex-1 flex flex-col p-6 fade-in">
          <div className="flex-1 flex flex-col justify-center text-center">
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4">Exercice {currentExIdx + 1} / {session.exercises.length}</span>
            <h1 className="text-5xl font-headline text-white mb-6 leading-tight uppercase">{currentExercise.name}</h1>
            <div className="flex justify-center gap-6 mb-10">
              <div className="bg-secondary px-8 py-4 rounded-3xl">
                <span className="text-4xl font-headline text-white">{currentExercise.sets}</span>
                <span className="text-[10px] block font-bold text-zinc-500 uppercase">Séries</span>
              </div>
              <div className="bg-secondary px-8 py-4 rounded-3xl">
                <span className="text-4xl font-headline text-white">{currentExercise.reps}</span>
                <span className="text-[10px] block font-bold text-zinc-500 uppercase">Reps</span>
              </div>
            </div>
            <p className="text-lg text-zinc-400 italic max-w-xs mx-auto">"{currentExercise.technique}"</p>
          </div>

          <div className="pb-10">
            <Button onClick={handleNext} className="w-full h-20 rounded-3xl text-2xl font-headline bg-primary text-white shadow-2xl">
              SÉRIE {currentSet} TERMINÉE
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 fade-in text-center">
          <div className="relative w-64 h-64 flex items-center justify-center mb-10">
             <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
             <div className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000" style={{ clipPath: `inset(${(1 - timeLeft/60)*100}% 0 0 0)` }} />
             <div className="flex flex-col items-center">
                <Timer className="w-10 h-10 text-primary mb-2" />
                <span className="text-8xl font-headline text-white leading-none">{timeLeft}</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Repos</span>
             </div>
          </div>
          <Button variant="ghost" onClick={() => setIsResting(false)} className="text-zinc-500 uppercase font-bold text-sm tracking-widest">
            Passer le repos
          </Button>
        </div>
      )}
    </div>
  );
}
