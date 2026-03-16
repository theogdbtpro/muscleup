
"use client";

import { useEffect, useState, useMemo } from "react";
import { UserProfile } from "@/app/page";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, History, Settings2, Flame, Dumbbell, TrendingUp, CheckCircle2, Sparkles, Loader2, Bot } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { analyzeUserProgress } from "@/ai/flows/analyze-progress";
import { useToast } from "@/hooks/use-toast";

type ProgressTabProps = {
  profile: UserProfile;
  onReset: () => void;
};

export default function ProgressTab({ profile, onReset }: ProgressTabProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("muscleup_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const streak = useMemo(() => {
    if (history.length === 0) return 0;
    
    const uniqueDates = Array.from(new Set(history.map(h => {
      try {
        const d = new Date(h.date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0];
      } catch { return null; }
    }))).filter(Boolean) as string[];

    uniqueDates.sort((a, b) => b.localeCompare(a));
    if (uniqueDates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

    let count = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i+1]);
      const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [history]);

  const chartData = useMemo(() => {
    const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
    return weeks.map((w, i) => ({
      name: w,
      count: i === 3 ? (history.filter(h => {
        const d = new Date(h.date);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        return diff <= 7;
      }).length) : Math.floor(Math.random() * 4) + 1
    }));
  }, [history]);

  const handleAnalyze = async () => {
    if (history.length === 0) {
      toast({ title: "Pas assez de données", description: "Fais au moins une séance pour l'analyser !" });
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await analyzeUserProgress({
        history: history.slice(0, 10),
        profile: { objective: profile.objective, level: profile.level }
      });
      setAiAnalysis(res.analysis);
    } catch (e) {
      toast({ variant: "destructive", title: "Erreur IA", description: "Impossible d'analyser tes progrès." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const muscleGroups = ["Pectoraux", "Dos", "Bras", "Jambes", "Abdos"];
  const getProgress = (muscle: string) => {
    const base = Math.min(100, history.length * 8);
    if (profile.objective.toLowerCase().includes(muscle.toLowerCase().slice(0, 3))) return Math.min(100, base + 20);
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

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary border-none rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-primary" />
          </div>
          <Flame className="w-10 h-10 text-primary mb-2 flame-animation" />
          <span className="text-4xl font-headline text-white">{streak}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Jours de Streak</span>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-secondary border-none rounded-3xl flex flex-col items-center text-center">
          <Trophy className="w-10 h-10 text-accent mb-2" />
          <span className="text-4xl font-headline text-white">{history.length}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Séances total</span>
        </Card>
      </div>

      {/* IA Analysis Button & Card */}
      <div className="mb-8">
        {!aiAnalysis ? (
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full h-14 rounded-2xl bg-secondary border border-zinc-800 text-white font-headline text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-accent" />}
            ANALYSER MES PROGRÈS
          </Button>
        ) : (
          <Card className="p-5 bg-gradient-to-br from-zinc-900 to-black border border-accent/30 rounded-3xl shadow-[0_0_20px_rgba(238,59,170,0.1)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent" />
                <h3 className="text-xs font-bold text-accent uppercase tracking-widest">Rapport IA Coach</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAiAnalysis(null)} className="h-6 text-[8px] uppercase font-bold text-muted-foreground">Fermer</Button>
            </div>
            <p className="text-sm font-medium leading-relaxed italic text-zinc-300">
              "{aiAnalysis}"
            </p>
          </Card>
        )}
      </div>

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
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{muscle}</span>
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
                    <div className="font-bold text-sm text-white">{item.day} - {item.objective}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      {new Date(item.date).toLocaleDateString('fr-FR')} • {item.exercises} exos
                    </div>
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
