
"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/app/page";
import { generateNutritionAdvice, GenerateNutritionAdviceOutput } from "@/ai/flows/generate-nutrition-advice";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Utensils, Apple, Timer, Info } from "lucide-react";
import { PROGRAMS } from "@/data/programs";

type NutritionTabProps = {
  profile: UserProfile;
};

export default function NutritionTab({ profile }: NutritionTabProps) {
  const [advice, setAdvice] = useState<GenerateNutritionAdviceOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const program = PROGRAMS.find(p => p.id === profile.objective);

  useEffect(() => {
    async function getAdvice() {
      try {
        const res = await generateNutritionAdvice({ objective: program?.name || "Musculation" });
        setAdvice(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getAdvice();
  }, [program]);

  if (loading) {
    return (
      <div className="p-6 fade-in flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="w-16 h-16 relative mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-headline text-white mb-2">Coach IA Nutrition</h2>
        <p className="text-muted-foreground max-w-[280px]">Préparation de ton plan nutritionnel personnalisé pour "{program?.name}"...</p>
      </div>
    );
  }

  return (
    <div className="p-6 fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline text-white">Nutrition</h1>
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>

      {!advice ? (
        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl text-center">
          <Info className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-sm">Erreur lors de la génération des conseils. Vérifie ta connexion.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary border-none rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-headline">Protéines</h2>
            </div>
            <p className="text-lg font-bold leading-snug">{advice.proteinRecommendation}</p>
          </Card>

          <Card className="p-6 bg-secondary border-none rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/20 rounded-xl">
                <Apple className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-headline">Aliments Clés</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {advice.keyFoods.map((food, i) => (
                <Badge key={i} className="bg-zinc-800 hover:bg-zinc-700 text-white border-none py-1.5 px-3 rounded-lg">
                  {food}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-secondary border-none rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Timer className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-headline">Timing Repas</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{advice.mealTimingSuggestions}</p>
          </Card>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-black/40 text-[10px] text-muted-foreground uppercase tracking-wider text-center flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3" /> Conseils générés par l'IA MuscleUp
          </div>
        </div>
      )}
    </div>
  );
}
