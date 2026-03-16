
"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS, Session } from "@/data/programs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, Flame, Clock, PlayCircle } from "lucide-react";
import ActiveSession from "./active-session";

type ProgramTabProps = {
  profile: UserProfile;
};

export default function ProgramTab({ profile }: ProgramTabProps) {
  const { toast } = useToast();
  const program = PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1));
  const [isActiveSessionOpen, setIsActiveSessionOpen] = useState(false);
  const [finishedToday, setFinishedToday] = useState(false);

  useEffect(() => {
    const savedFinished = localStorage.getItem("muscleup_history");
    if (savedFinished) {
      const history = JSON.parse(savedFinished);
      const today = new Date().toISOString().split('T')[0];
      const hasFinishedToday = history.some((h: any) => {
        const hDate = new Date(h.date).toISOString().split('T')[0];
        return hDate === today && h.day === selectedDay;
      });
      setFinishedToday(hasFinishedToday);
    }
  }, [selectedDay]);

  const currentSession = program.sessions.find(s => s.day === selectedDay) || program.sessions[0];

  const handleFinishSession = () => {
    const historyItem = {
      objective: program.name,
      day: currentSession.day,
      date: new Date().toISOString(), // Utilisation du format ISO pour la fiabilité
      exercises: currentSession.exercises.length
    };

    const existingHistory = JSON.parse(localStorage.getItem("muscleup_history") || "[]");
    localStorage.setItem("muscleup_history", JSON.stringify([historyItem, ...existingHistory]));

    setIsActiveSessionOpen(false);
    setFinishedToday(true);
    toast({
      title: "SÉANCE TERMINÉE ! 💥",
      description: "Excellent travail, ton historique a été mis à jour.",
    });
  };

  return (
    <div className="p-6 fade-in pb-32">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-headline text-white leading-none">Mon Programme</h1>
          <Badge variant="outline" className="mt-1 border-primary text-primary font-bold">{program.name}</Badge>
        </div>
        <div className="bg-secondary p-3 rounded-2xl flex flex-col items-center">
          <Flame className="w-6 h-6 text-primary mb-1 animate-pulse" />
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
              <h2 className="text-xl font-headline text-white">Aujourd'hui</h2>
              <span className="text-xs text-muted-foreground font-bold uppercase">{currentSession.exercises.length} Exercices</span>
            </div>
            
            {currentSession.exercises.map((ex) => (
              <Card key={ex.name} className="p-4 bg-secondary border-none rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center text-xl">
                  {ex.muscle === 'Biceps' && '💪'}
                  {ex.muscle === 'Triceps' && '🧨'}
                  {ex.muscle === 'Pectoraux' && '🦍'}
                  {ex.muscle === 'Dos' && '🦅'}
                  {ex.muscle === 'Jambes' && '🍗'}
                  {ex.muscle === 'Abdos' && '🛡️'}
                  {ex.muscle === 'Épaules' && '🏔️'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-tight">{ex.name}</h3>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-primary uppercase">{ex.sets} séries</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{ex.reps} reps</span>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              disabled={finishedToday}
              onClick={() => setIsActiveSessionOpen(true)}
              className={cn(
                "w-full h-16 rounded-2xl mt-8 text-xl font-headline transition-all",
                finishedToday ? "bg-green-500/20 text-green-500" : "bg-primary animate-bounce shadow-[0_10px_20px_rgba(226,75,74,0.3)]"
              )}
            >
              {finishedToday ? (
                <span className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6" /> SÉANCE TERMINÉE</span>
              ) : (
                <span className="flex items-center gap-2"><PlayCircle className="w-6 h-6" /> LANCER LA SÉANCE</span>
              )}
            </Button>
          </>
        )}
      </div>

      {isActiveSessionOpen && (
        <ActiveSession 
          session={currentSession} 
          onClose={() => setIsActiveSessionOpen(false)}
          onFinish={handleFinishSession}
        />
      )}
    </div>
  );
}
