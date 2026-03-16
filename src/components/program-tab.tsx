
"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS, Session } from "@/data/programs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, Flame, Clock } from "lucide-react";

type ProgramTabProps = {
  profile: UserProfile;
};

export default function ProgramTab({ profile }: ProgramTabProps) {
  const { toast } = useToast();
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1));
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [finishedSessions, setFinishedSessions] = useState<string[]>([]);
  const [isAnimatingFinish, setIsAnimatingFinish] = useState(false);

  useEffect(() => {
    const savedFinished = localStorage.getItem("muscleup_history");
    if (savedFinished) {
      const history = JSON.parse(savedFinished);
      setFinishedSessions(history.map((h: any) => `${h.day}-${h.date}`));
    }
  }, []);

  const currentSession = program.sessions.find(s => s.day === selectedDay) || program.sessions[0];

  const toggleExercise = (name: string) => {
    setCompletedExercises(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFinishSession = () => {
    const historyItem = {
      objective: program.name,
      day: currentSession.day,
      date: new Date().toLocaleDateString(),
      exercises: currentSession.exercises.length
    };

    const existingHistory = JSON.parse(localStorage.getItem("muscleup_history") || "[]");
    localStorage.setItem("muscleup_history", JSON.stringify([historyItem, ...existingHistory]));

    setIsAnimatingFinish(true);
    toast({
      title: "SÉANCE TERMINÉE ! 💥",
      description: "Excellent travail, continue comme ça !",
    });

    setTimeout(() => {
      setIsAnimatingFinish(false);
      setFinishedSessions(prev => [...prev, `${currentSession.day}-${historyItem.date}`]);
      setCompletedExercises({});
    }, 2000);
  };

  const isAllChecked = currentSession.exercises.length > 0 && currentSession.exercises.every(ex => completedExercises[ex.name]);

  return (
    <div className={cn("p-6 fade-in min-h-full transition-colors duration-500", isAnimatingFinish && "bg-green-950/30")}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-headline text-white leading-none">Mon Programme</h1>
          <Badge variant="outline" className="mt-1 border-primary text-primary font-bold">{program.name}</Badge>
        </div>
        <div className="bg-secondary p-3 rounded-2xl flex flex-col items-center">
          <Flame className="w-6 h-6 text-primary mb-1" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Semaine 1</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        {program.sessions.map((s) => (
          <button
            key={s.day}
            onClick={() => setSelectedDay(s.day)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[50px] h-16 rounded-2xl border transition-all",
              selectedDay === s.day ? "bg-primary border-primary" : "bg-secondary border-transparent text-muted-foreground"
            )}
          >
            <span className="text-[10px] font-bold uppercase mb-1">{s.day.slice(0, 3)}</span>
            <span className="text-sm font-bold">{s.day === selectedDay ? "🔥" : (!s.isRestDay ? "🏋️" : "💤")}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {currentSession.isRestDay ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-headline text-white">Repos Bien Mérité</h2>
            <p className="text-muted-foreground max-w-[250px]">Le muscle se construit au repos. Récupère bien !</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-xl font-headline text-white">Séance du Jour</h2>
              <span className="text-xs text-muted-foreground font-bold uppercase">{currentSession.exercises.length} Exercices</span>
            </div>
            {currentSession.exercises.map((ex) => (
              <Card key={ex.name} className={cn(
                "p-4 bg-secondary border-none rounded-2xl transition-all duration-300",
                completedExercises[ex.name] && "opacity-50"
              )}>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{ex.name}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs font-medium text-primary uppercase">{ex.sets} séries</span>
                      <span className="text-xs font-medium text-muted-foreground uppercase">{ex.reps} reps</span>
                    </div>
                  </div>
                  <Checkbox
                    id={ex.name}
                    checked={completedExercises[ex.name]}
                    onCheckedChange={() => toggleExercise(ex.name)}
                    className="w-8 h-8 rounded-full border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                </div>
                {completedExercises[ex.name] ? null : (
                  <div className="mt-3 pt-3 border-t border-zinc-800 text-[11px] text-muted-foreground italic">
                    💡 {ex.technique}
                  </div>
                )}
              </Card>
            ))}

            <Button
              disabled={!isAllChecked || isAnimatingFinish}
              onClick={handleFinishSession}
              className={cn(
                "w-full h-16 rounded-2xl mt-8 text-xl font-headline transition-all",
                isAllChecked ? "bg-primary animate-pulse" : "bg-zinc-800"
              )}
            >
              {isAnimatingFinish ? <CheckCircle2 className="w-8 h-8" /> : "TERMINER LA SÉANCE"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
