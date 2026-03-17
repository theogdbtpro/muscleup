
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Utensils, Flame, Apple } from "lucide-react";

type NutritionTabProps = {
  profile: UserProfile;
  onBack: () => void;
};

export default function NutritionTab({ profile, onBack }: NutritionTabProps) {
  const program = PROGRAMS.find(p => p.id === profile.objective) || PROGRAMS[0];
  const [weight, setWeight] = useState("");
  const proteinNeed = weight ? Math.round(parseFloat(weight) * 2) : 0;

  return (
    <div className="min-h-full bg-background flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white">Nutrition</h1>
      </header>

      <div className="space-y-12 flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Calculator */}
        <section className="bg-secondary/50 rounded-[2.5rem] p-8 text-center border border-zinc-800">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Ton Apport Idéal</h2>
          <div className="flex flex-col items-center gap-4">
            <Input 
              type="number" 
              placeholder="Ton poids (kg)" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-black/40 border-zinc-800 h-16 rounded-2xl text-center text-2xl font-bold text-white focus:ring-primary w-48 mx-auto"
            />
            <div className="space-y-1">
              <span className="text-7xl font-headline text-white">{proteinNeed || "--"}g</span>
              <p className="text-zinc-500 text-xs font-bold uppercase">Protéines / Jour</p>
            </div>
          </div>
        </section>

        {/* Meal Plan */}
        <section>
          <h2 className="text-xl font-headline text-white mb-6 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" /> Plan Repas Type
          </h2>
          <div className="space-y-6">
            {program.nutrition.meals.map((meal, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="text-primary font-headline text-xl w-14 pt-1">{meal.time}</div>
                <div className="flex-1 pb-6 border-b border-zinc-800/50">
                  <h4 className="font-bold text-white text-lg mb-1">{meal.name}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{meal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <div className="bg-primary/10 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Objectif : {program.nutrition.caloriesGoal}</p>
        </div>
      </div>
    </div>
  );
}
