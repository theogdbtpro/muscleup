"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, Timer, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type ProgramTabProps = {
  profile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
};

export default function ProgramTab({ profile, onBack, onUpdateProfile }: ProgramTabProps) {
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  const currentSession = program.sessions[0];
  const [checkedExercises, setCheckedExercises] = useState<number[]>([]);
  const [showFrequencySettings, setShowFrequencySettings] = useState(false);

  const progress = (checkedExercises.length / currentSession.exercises.length) * 100;

  const toggleExercise = (idx: number) => {
    if (checkedExercises.includes(idx)) {
      setCheckedExercises(checkedExercises.filter(i => i !== idx));
    } else {
      setCheckedExercises([...checkedExercises, idx]);
    }
  };

  const handleUpdateFrequency = (newFreq: string) => {
    onUpdateProfile({ ...profile, frequency: newFreq });
    setShowFrequencySettings(false);
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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowFrequencySettings(!showFrequencySettings)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showFrequencySettings ? "bg-primary text-white" : "text-zinc-500 hover:text-white bg-zinc-900"
            )}
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Exercice</span>
            <span className="text-xl font-headline text-white">{checkedExercises.length} / {currentSession.exercises.length}</span>
          </div>
        </div>
      </header>

      {showFrequencySettings && (
        <div className="mb-8 p-6 bg-[#1A1A1A] rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Objectif hebdomadaire</h3>
          <div className="grid grid-cols-4 gap-2">
            {["2j", "3j", "4j", "5j"].map((f) => (
              <button
                key={f}
                onClick={() => handleUpdateFrequency(f)}
                className={cn(
                  "h-12 rounded-xl border-2 transition-all flex items-center justify-center font-headline text-xl",
                  profile.frequency === f
                    ? "bg-primary border-primary text-white shadow-lg"
                    : "bg-zinc-900 border-transparent text-zinc-500"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-zinc-500 uppercase font-bold tracking-tight">Modifier le nombre de séances par semaine.</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full mb-10 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-10">
        <h2 className="text-4xl font-headline text-white mb-6 leading-none uppercase">
          {currentSession.name}
        </h2>
        
        {currentSession.exercises.map((ex, idx) => {
          const isChecked = checkedExercises.includes(idx);
          return (
            <div 
              key={idx} 
              onClick={() => toggleExercise(idx)}
              className={cn(
                "p-5 rounded-2xl border transition-all flex items-center gap-5 cursor-pointer",
                isChecked ? "bg-primary/5 border-primary/30" : "bg-[#1A1A1A] border-transparent"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                isChecked ? "bg-primary border-primary text-white" : "border-[#2A2A2A] text-zinc-600"
              )}>
                {isChecked ? <Check className="w-5 h-5" /> : <span className="font-bold text-xs">{idx + 1}</span>}
              </div>
              
              <div className="flex-1">
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
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F] to-transparent">
        <Button
          onClick={handleFinish}
          disabled={checkedExercises.length === 0}
          className="w-full h-14 rounded-xl text-xl font-headline bg-primary text-white shadow-xl shadow-primary/20"
        >
          TERMINER LA SÉANCE
        </Button>
      </div>
    </div>
  );
}
