
"use client";

import { useState, useMemo, useEffect } from "react";
import { BodyProfile } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Scale, Ruler, Calendar, User, Target, Activity, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BodyProfileProps = {
  initialData?: BodyProfile;
  onSave: (data: BodyProfile) => void;
  onBack: () => void;
};

const BLESSURES_OPTIONS = ["Dos", "Genoux", "Épaules", "Poignets", "Cervicales", "Hanches", "Chevilles", "Aucune"];

const ACTIVITE_INFO = {
  'sedentaire': { label: 'Sédentaire', desc: 'Bureau toute la journée, peu de marche' },
  'leger': { label: 'Légèrement actif', desc: 'Marche quotidienne, 1-2 séances/sem' },
  'modere': { label: 'Modérément actif', desc: 'Actif physiquement, 3-4 séances/sem' },
  'actif': { label: 'Très actif', desc: 'Travail physique, 5+ séances/sem' },
  'tres-actif': { label: 'Extrêmement actif', desc: 'Athlète pro ou métier très physique' }
};

export default function BodyProfileView({ initialData, onSave, onBack }: BodyProfileProps) {
  const [formData, setFormData] = useState<BodyProfile>(initialData || {
    poids: 70,
    taille: 175,
    age: 25,
    sexe: 'homme',
    objectifPoids: 'maintenir',
    activiteQuotidienne: 'modere',
    blessures: [],
  });

  const stats = useMemo(() => {
    const { poids, taille, age, sexe, activiteQuotidienne, objectifPoids } = formData;
    
    // IMC
    const imc = poids / ((taille / 100) ** 2);
    let imcCat = "";
    if (imc < 18.5) imcCat = "Insuffisance";
    else if (imc < 25) imcCat = "Normal";
    else if (imc < 30) imcCat = "Surpoids";
    else imcCat = "Obésité";

    // Calories (Mifflin-St Jeor)
    const bmr = (10 * poids) + (6.25 * taille) - (5 * age) + (sexe === 'homme' ? 5 : -161);
    const activityMultipliers = { 'sedentaire': 1.2, 'leger': 1.375, 'modere': 1.55, 'actif': 1.725, 'tres-actif': 1.9 };
    let tdee = bmr * activityMultipliers[activiteQuotidienne];
    
    if (objectifPoids === 'perdre') tdee -= 400;
    if (objectifPoids === 'prendre') tdee += 400;

    // Poids idéal (Lorentz)
    const poidsIdeal = sexe === 'homme' 
      ? (taille - 100) - ((taille - 150) / 4)
      : (taille - 100) - ((taille - 150) / 2);

    return { imc: imc.toFixed(1), imcCat, calories: Math.round(tdee), poidsIdeal: poidsIdeal.toFixed(1) };
  }, [formData]);

  const toggleBlessure = (opt: string) => {
    if (opt === "Aucune") {
      setFormData(prev => ({ ...prev, blessures: ["Aucune"] }));
      return;
    }
    const newBlessures = formData.blessures.filter(b => b !== "Aucune");
    if (newBlessures.includes(opt)) {
      setFormData(prev => ({ ...prev, blessures: newBlessures.filter(b => b !== opt) }));
    } else {
      setFormData(prev => ({ ...prev, blessures: [...newBlessures, opt] }));
    }
  };

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white tracking-tight uppercase">PROFIL CORPOREL</h1>
      </header>

      <div className="space-y-12 flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Section 1: Base */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mesures de base</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase">Poids (kg)</label>
              <Input 
                type="number" 
                value={formData.poids}
                onChange={(e) => setFormData(prev => ({ ...prev, poids: parseFloat(e.target.value) || 0 }))}
                className="bg-[#1A1A1A] border-none h-14 text-xl font-headline"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase">Taille (cm)</label>
              <Input 
                type="number" 
                value={formData.taille}
                onChange={(e) => setFormData(prev => ({ ...prev, taille: parseFloat(e.target.value) || 0 }))}
                className="bg-[#1A1A1A] border-none h-14 text-xl font-headline"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase">Âge</label>
              <Input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                className="bg-[#1A1A1A] border-none h-14 text-xl font-headline"
              />
            </div>
            <div className="flex gap-2 pt-6">
              <button 
                onClick={() => setFormData(prev => ({ ...prev, sexe: 'homme' }))}
                className={cn("flex-1 h-14 rounded-xl font-headline text-lg border-2 transition-all", 
                  formData.sexe === 'homme' ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}
              >H</button>
              <button 
                onClick={() => setFormData(prev => ({ ...prev, sexe: 'femme' }))}
                className={cn("flex-1 h-14 rounded-xl font-headline text-lg border-2 transition-all", 
                  formData.sexe === 'femme' ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}
              >F</button>
            </div>
          </div>
        </section>

        {/* Section 2: Objectif Poids */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Objectif corporel</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'perdre', label: 'Perdre du poids 🔥' },
              { id: 'maintenir', label: 'Maintenir mon poids ⚖️' },
              { id: 'prendre', label: 'Prendre de la masse 💪' }
            ].map(obj => (
              <button
                key={obj.id}
                onClick={() => setFormData(prev => ({ ...prev, objectifPoids: obj.id as any }))}
                className={cn("p-5 rounded-2xl border-2 transition-all text-left font-headline text-xl",
                  formData.objectifPoids === obj.id ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}
              >
                {obj.label}
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Activité */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Activité quotidienne</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(ACTIVITE_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setFormData(prev => ({ ...prev, activiteQuotidienne: key as any }))}
                className={cn("w-full p-4 rounded-2xl border-2 transition-all text-left group",
                  formData.activiteQuotidienne === key ? "bg-primary/10 border-primary" : "bg-[#1A1A1A] border-transparent")}
              >
                <div className={cn("font-headline text-lg uppercase", formData.activiteQuotidienne === key ? "text-white" : "text-zinc-500")}>
                  {info.label}
                </div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{info.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 4: Mensurations Optionnelles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mensurations</h2>
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded-md">Optionnel</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase">Taille</label>
              <Input 
                type="number" 
                placeholder="0"
                value={formData.tourTaille}
                onChange={(e) => setFormData(prev => ({ ...prev, tourTaille: parseFloat(e.target.value) || 0 }))}
                className="bg-[#1A1A1A] border-none h-12 text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase">Hanches</label>
              <Input 
                type="number" 
                placeholder="0"
                value={formData.tourHanche}
                onChange={(e) => setFormData(prev => ({ ...prev, tourHanche: parseFloat(e.target.value) || 0 }))}
                className="bg-[#1A1A1A] border-none h-12 text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase">Poitrine</label>
              <Input 
                type="number" 
                placeholder="0"
                value={formData.tourPoitrine}
                onChange={(e) => setFormData(prev => ({ ...prev, tourPoitrine: parseFloat(e.target.value) || 0 }))}
                className="bg-[#1A1A1A] border-none h-12 text-center"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Blessures */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Blessures & Zones sensibles</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {BLESSURES_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => toggleBlessure(opt)}
                className={cn("px-4 py-2.5 rounded-xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all",
                  formData.blessures.includes(opt) ? "bg-primary text-white border-primary" : "bg-[#1A1A1A] border-transparent text-zinc-600")}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Section 6: Résultats */}
        <section className="bg-primary/5 border border-primary/20 rounded-[30px] p-8 space-y-8 shadow-2xl">
          <div className="text-center">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Résultats calculés
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center space-y-1">
              <div className="text-4xl font-headline text-white leading-none">{stats.imc}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">IMC ({stats.imcCat})</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-4xl font-headline text-white leading-none">{stats.calories}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Kcal / Jour</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-4xl font-headline text-white leading-none">{stats.poidsIdeal} kg</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Poids idéal est.</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-4xl font-headline text-white leading-none">3-4</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Séances conseillées</div>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-[#0F0F0F] z-50">
        <Button 
          onClick={() => onSave(formData)}
          className="w-full h-16 rounded-2xl text-xl font-headline bg-primary text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-6 h-6" />
          SAUVEGARDER MON PROFIL ✓
        </Button>
      </div>
    </div>
  );
}
