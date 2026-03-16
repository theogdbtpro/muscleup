
"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/app/page";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, History, Settings2, Trash2, Dumbbell } from "lucide-react";
import { PROGRAMS } from "@/data/programs";

type ProgressTabProps = {
  profile: UserProfile;
  onReset: () => void;
};

export default function ProgressTab({ profile, onReset }: ProgressTabProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("muscleup_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const totalExercises = history.reduce((acc, curr) => acc + (curr.exercises || 0), 0);
  const muscleGroups = ["Pectoraux", "Dos", "Bras", "Jambes", "Abdos"];
  
  // Fake animated progress based on history length for demo
  const getProgress = (muscle: string) => {
    const base = Math.min(100, history.length * 10);
    if (profile.objective.includes(muscle.toLowerCase())) return Math.min(100, base + 20);
    return base;
  };

  return (
    <div className="p-6 fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline text-white">Progrès</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => {
           if(confirm("Voulez-vous réinitialiser votre profil ?")) onReset();
        }}>
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-4 bg-secondary border-none rounded-2xl flex flex-col items-center text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
          <span className="text-2xl font-headline">{history.length}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Séances</span>
        </Card>
        <Card className="p-4 bg-secondary border-none rounded-2xl flex flex-col items-center text-center">
          <Dumbbell className="w-8 h-8 text-primary mb-2" />
          <span className="text-2xl font-headline">{totalExercises}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Exercices</span>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-headline text-white mb-4">Focus Musculaire</h2>
        <div className="space-y-4">
          {muscleGroups.map(muscle => (
            <div key={muscle} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider">{muscle}</span>
                <span className="text-xs text-primary font-bold">{getProgress(muscle)}%</span>
              </div>
              <Progress value={getProgress(muscle)} className="h-2 bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-headline text-white">Historique Récent</h2>
        </div>
        {history.length === 0 ? (
          <div className="p-10 text-center bg-secondary rounded-2xl text-muted-foreground">
            Aucune séance terminée pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl border border-zinc-800">
                <div>
                  <div className="font-bold">{item.day} - {item.objective}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{item.date} • {item.exercises} exos</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
