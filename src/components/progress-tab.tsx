
"use client";

import { useEffect, useState, useMemo } from "react";
import { UserProfile } from "@/app/page";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Flame, Trophy, History, Dumbbell } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

type ProgressTabProps = {
  profile: UserProfile;
  onReset: () => void;
  onBack: () => void;
};

export default function ProgressTab({ profile, onReset, onBack }: ProgressTabProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("muscleup_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const chartData = useMemo(() => {
    const weeks = ["S-3", "S-2", "S-1", "S0"];
    return weeks.map((w, i) => ({
      name: w,
      count: i === 3 ? (history.length % 5 || 1) : Math.floor(Math.random() * 4) + 1
    }));
  }, [history]);

  return (
    <div className="min-h-full bg-background flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white">Progrès</h1>
      </header>

      <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 p-6 rounded-[2rem] text-center border border-zinc-800">
            <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-4xl font-headline text-white">4 Jours</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase">Streak</div>
          </div>
          <div className="bg-secondary/50 p-6 rounded-[2rem] text-center border border-zinc-800">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-4xl font-headline text-white">{history.length}</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase">Séances</div>
          </div>
        </div>

        {/* Activity Chart */}
        <section>
          <h2 className="text-xl font-headline text-white mb-4">Activité Mensuelle</h2>
          <div className="h-40 bg-secondary/30 rounded-3xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#E24B4A' : '#27272a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent History */}
        <section>
          <h2 className="text-xl font-headline text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-500" /> Historique
          </h2>
          <div className="space-y-3">
            {history.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-secondary/40 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-bold text-white text-sm">{item.day}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={() => { if(confirm("Réinitialiser ?")) onReset(); }}
          className="w-full py-4 text-xs font-bold text-zinc-700 uppercase tracking-widest"
        >
          Réinitialiser le profil
        </button>
      </div>
    </div>
  );
}
