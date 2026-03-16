
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, Utensils, Apple, Timer, Flame, Calculator, ChevronRight } from "lucide-react";
import { PROGRAMS } from "@/data/programs";
import { cn } from "@/lib/utils";

type NutritionTabProps = {
  profile: UserProfile;
};

export default function NutritionTab({ profile }: NutritionTabProps) {
  const program = PROGRAMS.find(p => p.id === profile.objective) || PROGRAMS[0];
  const { nutrition } = program;
  const [weight, setWeight] = useState("");

  const proteinNeed = weight ? Math.round(parseFloat(weight) * 2) : 0;

  return (
    <div className="p-6 fade-in pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline text-white">Nutrition</h1>
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>

      <div className="space-y-6">
        {/* Protein Calculator */}
        <Card className="p-6 bg-secondary border-none rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-headline">Calculateur Protéines</h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input 
                type="number" 
                placeholder="Poids (kg)" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-black/40 border-zinc-800 h-12 rounded-xl text-lg font-bold"
              />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-primary/10 rounded-xl py-2 h-12">
              <span className="text-xl font-headline text-primary leading-none">{proteinNeed || '--'} g</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Quotidien</span>
            </div>
          </div>
        </Card>

        {/* Calories Goal */}
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-secondary border-none rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/20 rounded-xl">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-xl font-headline">Objectif Calories</h2>
          </div>
          <p className="text-lg font-bold leading-snug">{nutrition.caloriesGoal}</p>
        </Card>

        {/* Plan Repas Type */}
        <div>
          <h2 className="text-xl font-headline text-white mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" /> Plan Repas Idéal
          </h2>
          <div className="space-y-3">
            {nutrition.meals.map((meal, i) => (
              <div key={i} className="bg-secondary/50 border border-zinc-800 rounded-2xl p-4 flex gap-4">
                <div className="text-primary font-headline text-lg w-12 shrink-0">{meal.time}</div>
                <div>
                  <h4 className="font-bold text-sm mb-0.5">{meal.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{meal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Foods */}
        <Card className="p-6 bg-secondary border-none rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded-xl">
              <Apple className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-xl font-headline">Aliments Clés</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {nutrition.keyFoods.map((food, i) => (
              <Badge key={i} className="bg-zinc-800 hover:bg-zinc-700 text-white border-none py-1.5 px-3 rounded-lg text-sm">
                {food}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Timing */}
        <Card className="p-6 bg-secondary border-none rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Timer className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-headline">Timing Stratégique</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-white font-bold">Pré-entraînement :</span> 1h30 avant pour l'énergie.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-white font-bold">Post-entraînement :</span> Dans les 30 min pour la récup.
              </p>
            </div>
          </div>
        </Card>

        <div className="p-4 rounded-2xl border border-zinc-800 bg-black/40 text-[10px] text-muted-foreground uppercase tracking-wider text-center flex items-center justify-center gap-2">
          Nutrition optimisée pour {program.name}
        </div>
      </div>
    </div>
  );
}
