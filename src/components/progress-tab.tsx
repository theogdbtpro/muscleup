"use client";

import { useEffect, useState, useMemo } from "react";
import { UserProfile } from "@/app/page";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, History, Settings2, Flame, Dumbbell, TrendingUp, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

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
  
  // Calcul du Streak
  const streak = useMemo(() => {
    if (history.length === 0) return 0;
    let count = 0;
    const sortedDates = [...new Set(history.map(h => h.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let current = new Date();
    current.setHours(0,0,0,0);
    
    for(let dateStr of sortedDates) {
      let d = new Date(dateStr);
      d.setHours(0,0,0,0);
      const diffDays = Math.floor((current.getTime() - d.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === count) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [history]);

  // Données pour le graphique (4 dernières semaines)
  const chartData = useMemo(() => {
    const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
    return weeks.map((w, i) => ({
      name: w,
      count: Math.floor(Math.random() * 5) + (i === 3 ? Math.min(history.length, 5) : 0) // Mock logic for demo
    }));
  }, [history]);

  const motivationMessage = useMemo(() => {
    if (history.length === 0) return "La première séance est la plus dure. Lance-toi !";
    if (streak > 2) return "Tu es sur une lancée incroyable ! Ne lâche rien.";
    if (history.length > 10) return "Ta discipline commence à payer. Continue comme ça.";
    return "Chaque goutte de sueur te rapproche de ton objectif.";
  }, [history, streak]);

  const muscleGroups = ["Pectoraux", "Dos", "Bras", "Jambes", "Abdos"];
  const getProgress = (muscle: string) => {
    const base = Math.min(100, history.length * 5);
    if (profile.objective.toLowerCase().includes(muscle.toLowerCase().slice(0, 3))) return Math.min(100, base + 15);
    return base;
  };

  return (
    <div className="p-6 fade-in pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline text-white">Progrès</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => {
           if(confirm("Voulez-vous réinitialiser votre profil ?")) onReset();
        }}>
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Streak & Trophy */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary border-none rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-primary" />
          </div>
          <Flame className="w-10 h-10 text-primary mb-2 animate-bounce" />
          <span className="text-4xl font-headline">{streak}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Jours de Streak</span>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-secondary border-none rounded-3xl flex flex-col items-center text-center">
          <Trophy className="w-10 h-10 text-accent mb-2" />
          <span className="text-4xl font-headline">{history.length}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Séances total</span>
        </Card>
      </div>

      {/* Motivation Card */}
      <Card className="p-5 bg-secondary border border-zinc-800 rounded-3xl mb-8 flex items-start gap-4">
        <div className="p-3 bg-zinc-800 rounded-2xl shrink-0">
          <TrendingUp className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase mb-1">Motivation</h3>
          <p className="text-sm font-medium leading-relaxed italic">"{motivationMessage}"</p>
        </div>
      </Card>

      {/* Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-headline text-white mb-4">Activité Hebdomadaire</h2>
        <Card className="p-4 bg-secondary border-none rounded-3xl h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 'bold'}} dy={10} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 3 ? '#E24B4A' : '#27272a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
          <div className="p-10 text-center bg-secondary rounded-3xl text-muted-foreground border border-zinc-800 border-dashed">
            Aucune séance terminée pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{item.day} - {item.objective}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{item.date} • {item.exercises} exos</div>
                  </div>
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
