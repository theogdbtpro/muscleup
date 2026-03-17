"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Utensils, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type NutritionTabProps = {
  profile: UserProfile;
  onBack: () => void;
};

export default function NutritionTab({ profile, onBack }: NutritionTabProps) {
  const program = PROGRAMS.find(p => p.id === profile.objective) || PROGRAMS[0];
  const [weight, setWeight] = useState("");
  const proteinNeed = weight ? Math.round(parseFloat(weight) * 2) : 0;

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white tracking-tight">NUTRITION</h1>
      </header>

      <div className="space-y-12 flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Calculator */}
        <section className="bg-[#1A1A1A] rounded-2xl p-8 text-center border border-[#2A2A2A] shadow-xl">
          <h2 className="text-xs font-bold text-[#E24B4A] uppercase tracking-widest mb-8">Calculateur de Protéines</h2>
          <div className="space-y-6">
            <div className="relative max-w-[160px] mx-auto">
              <Input 
                type="number" 
                placeholder="00" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-[#0F0F0F] border-[#2A2A2A] h-20 rounded-xl text-center text-4xl font-headline text-white focus:ring-[#E24B4A] pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline text-zinc-600 text-xl">KG</span>
            </div>
            <div className="space-y-1">
              <span className="text-7xl font-headline text-white leading-none tracking-tighter">{proteinNeed || "--"}G</span>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Apport Journalier Recommandé</p>
            </div>
          </div>
        </section>

        {/* Plan Repas */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-headline text-white tracking-wide">PLAN REPAS DU JOUR</h2>
            <span className="text-[10px] font-bold text-[#E24B4A] uppercase tracking-widest">{program.nutrition.caloriesGoal}</span>
          </div>
          <div className="space-y-4">
            {program.nutrition.meals.map((meal, i) => (
              <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 flex gap-5">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <Clock className="w-4 h-4 text-[#E24B4A]" />
                  <span className="text-xs font-headline text-white">{meal.time}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm uppercase tracking-tight mb-1">{meal.name}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-3">{meal.description}</p>
                  <div className="inline-flex items-center gap-2 bg-[#0F0F0F] px-3 py-1.5 rounded-lg border border-[#2A2A2A]">
                    <Zap className="w-3 h-3 text-[#EE3BAA]" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{meal.macros}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Foods Chips */}
        <section>
          <h2 className="text-xl font-headline text-white mb-4 tracking-wide">ALIMENTS CLÉS</h2>
          <div className="flex flex-wrap gap-2">
            {program.nutrition.keyFoods.map((food) => (
              <span key={food} className="px-4 py-2 bg-[#E24B4A]/10 text-[#E24B4A] text-[10px] font-bold uppercase rounded-lg border border-[#E24B4A]/20">
                {food}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}