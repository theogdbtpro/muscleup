"use client";

import { useEffect, useState, useMemo } from "react";
import { UserProfile } from "@/app/page";
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

  const muscleProgress = [
    { name: "Grand Dorsal", value: 85 },
    { name: "Pectoraux", value: 70 },
    { name: "Biceps", value: 90 },
    { name: "Quadriceps", value: 65 },
  ];

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white tracking-tight">PROGRÈS</h1>
      </header>

      <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1A1A1A] p-8 rounded-2xl text-center border border-[#2A2A2A]">
            <Flame className="w-8 h-8 text-[#E24B4A] mx-auto mb-3 fill-[#E24B4A]/10" />
            <div className="text-4xl font-headline text-white leading-none">{history.length} JOURS</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Streak Actuel</div>
          </div>
          <div className="bg-[#1A1A1A] p-8 rounded-2xl text-center border border-[#2A2A2A]">
            <Trophy className="w-8 h-8 text-[#EE3BAA] mx-auto mb-3 fill-[#EE3BAA]/10" />
            <div className="text-4xl font-headline text-white leading-none">{history.length}</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Total Séances</div>
          </div>
        </div>

        {/* Muscle Progress Bars */}
        <section>
          <h2 className="text-xl font-headline text-white mb-6 tracking-wide">DÉVELOPPEMENT MUSCULAIRE</h2>
          <div className="space-y-6">
            {muscleProgress.map((m) => (
              <div key={m.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>{m.name}</span>
                  <span>{m.value}%</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#E24B4A] transition-all duration-1000"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent History */}
        <section>
          <h2 className="text-xl font-headline text-white mb-6 flex items-center gap-2 tracking-wide">
            <History className="w-5 h-5 text-zinc-500" /> HISTORIQUE RÉCENT
          </h2>
          <div className="space-y-3">
            {history.slice(0, 5).length > 0 ? history.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#E24B4A]/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-[#E24B4A]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm uppercase tracking-tight">{item.day}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-0.5">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            )) : (
              <p className="text-center py-10 text-zinc-600 font-bold uppercase text-xs tracking-widest italic">Aucune séance enregistrée</p>
            )}
          </div>
        </section>

        <button 
          onClick={() => { if(confirm("Réinitialiser ton profil ?")) onReset(); }}
          className="w-full py-8 text-[10px] font-bold text-zinc-700 uppercase tracking-widest hover:text-[#E24B4A] transition-colors"
        >
          Réinitialiser le profil utilisateur
        </button>
      </div>
    </div>
  );
}