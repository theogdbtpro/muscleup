"use client";

import { UserProfile } from "@/app/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Utensils, Apple, Timer, Flame } from "lucide-react";
import { PROGRAMS } from "@/data/programs";

type NutritionTabProps = {
  profile: UserProfile;
};

export default function NutritionTab({ profile }: NutritionTabProps) {
  const program = PROGRAMS.find(p => p.id === profile.objective) || PROGRAMS[0];
  const { nutrition } = program;

  return (
    <div className="p-6 fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline text-white">Nutrition</h1>
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>

      <div className="space-y-6">
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

        {/* Proteins */}
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary border-none rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Utensils className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-headline">Protéines</h2>
          </div>
          <p className="text-lg font-bold leading-snug">Apport protéines : 2g par kg de poids corporel</p>
          <p className="text-xs text-muted-foreground mt-2 italic uppercase font-medium">Indispensable pour la reconstruction musculaire.</p>
        </Card>

        {/* Key Foods */}
        <Card className="p-6 bg-secondary border-none rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded-xl">
              <Apple className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-xl font-headline">3 Aliments Clés</h2>
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
            <h2 className="text-xl font-headline">Timing Repas</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-white font-bold">Pré-entraînement :</span> 1h30 avant la séance.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-white font-bold">Post-entraînement :</span> Dans les 30 minutes après l'effort.
              </p>
            </div>
          </div>
        </Card>

        <div className="p-4 rounded-2xl border border-zinc-800 bg-black/40 text-[10px] text-muted-foreground uppercase tracking-wider text-center flex items-center justify-center gap-2">
          Plan nutritionnel optimisé pour {program.name}
        </div>
      </div>
    </div>
  );
}
