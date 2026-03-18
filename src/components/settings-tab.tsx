"use client";

import { useState, useMemo, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Target, Award, Calendar, Repeat, ArrowRightLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsTabProps = {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
};

export default function SettingsTab({ profile, onUpdateProfile, onBack }: SettingsTabProps) {
  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [selectedDayToSwap, setSelectedDayToSwap] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

  const [schedule, setSchedule] = useState<Record<string, string | null>>(() => {
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    
    // Default initial generation
    return generateOptimizedSchedule(profile.frequency, profile.objective);
  });

  const currentProgram = PROGRAMS.find(p => p.id === tempProfile.objective) || PROGRAMS[0];

  function generateOptimizedSchedule(freq: string, objId: string) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const selectedDays: string[] = [];
    
    // Define target days based on frequency
    if (freq === "2j") selectedDays.push("Lundi", "Jeudi");
    else if (freq === "3j") selectedDays.push("Lundi", "Mercredi", "Vendredi");
    else if (freq === "4j") selectedDays.push("Lundi", "Mardi", "Jeudi", "Vendredi");
    else if (freq === "5j") selectedDays.push("Lundi", "Mardi", "Mercredi", "Vendredi", "Samedi");

    const program = PROGRAMS.find(p => p.id === objId) || PROGRAMS[0];
    const sessionIds = program.sessions.filter(s => !s.isRestDay).map(s => s.id);

    const newSchedule: Record<string, string | null> = {};
    days.forEach(d => newSchedule[d] = null);

    selectedDays.forEach((day, idx) => {
      // Alternate through available sessions
      newSchedule[day] = sessionIds[idx % sessionIds.length];
    });

    return newSchedule;
  }

  // Effect to regenerate schedule when frequency or objective changes
  const handleUpdateBaseInfo = (updates: Partial<UserProfile>) => {
    const newProfile = { ...tempProfile, ...updates };
    setTempProfile(newProfile);
    
    if (updates.frequency || updates.objective) {
      const newSchedule = generateOptimizedSchedule(
        updates.frequency || tempProfile.frequency, 
        updates.objective || tempProfile.objective
      );
      setSchedule(newSchedule);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    localStorage.setItem("muscleup_schedule", JSON.stringify(schedule));
    onBack();
  };

  const swapDays = (day1: string, day2: string) => {
    const newSchedule = { ...schedule };
    const temp = newSchedule[day1];
    newSchedule[day1] = newSchedule[day2];
    newSchedule[day2] = temp;
    setSchedule(newSchedule);
    setSelectedDayToSwap(null);
  };

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white tracking-tight uppercase">PARAMÈTRES</h1>
      </header>

      <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Objective Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Objectif actuel</h2>
          </div>
          <button 
            onClick={() => setIsObjectiveModalOpen(true)}
            className="w-full p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex justify-between items-center group"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{currentProgram.emoji}</span>
              <span className="font-headline text-2xl text-white uppercase">{currentProgram.name}</span>
            </div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Changer</span>
          </button>
        </section>

        {/* Level Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Niveau d'expérience</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
              <button
                key={l}
                onClick={() => handleUpdateBaseInfo({ level: l })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase",
                  tempProfile.level === l
                    ? "bg-primary/10 border-primary text-white"
                    : "bg-[#1A1A1A] border-transparent text-zinc-600"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* Frequency Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fréquence hebdomadaire</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["2j", "3j", "4j", "5j"].map((f) => (
              <button
                key={f}
                onClick={() => handleUpdateBaseInfo({ frequency: f })}
                className={cn(
                  "h-16 rounded-xl border-2 transition-all flex items-center justify-center font-headline text-2xl",
                  tempProfile.frequency === f
                    ? "bg-primary/10 border-primary text-white"
                    : "bg-[#1A1A1A] border-transparent text-zinc-600"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Planning de la semaine</h2>
            </div>
            {showSuccessMessage && (
              <div className="flex items-center gap-1.5 text-green-500 animate-in fade-in slide-in-from-right-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">Planning optimisé ✓</span>
              </div>
            )}
          </div>
          <div className="space-y-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {dayNamesFull.map((day) => {
              const sessionId = schedule[day];
              const session = currentProgram.sessions.find(s => s.id === sessionId);
              return (
                <div key={day} className="p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold w-12 text-zinc-600">{day}</span>
                    <span className={cn("text-sm font-bold uppercase tracking-tight", session ? "text-white" : "text-zinc-700")}>
                      {session ? session.name : "Repos"}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedDayToSwap(day)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-600 font-medium italic text-center">Clique sur les flèches pour déplacer une séance</p>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto p-6 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F] to-transparent">
        <Button
          onClick={handleSave}
          className="w-full h-16 rounded-xl text-xl font-headline bg-primary text-white shadow-xl shadow-primary/20"
        >
          SAUVEGARDER LES MODIFICATIONS
        </Button>
      </div>

      {/* Objective Picker Modal */}
      <Dialog open={isObjectiveModalOpen} onOpenChange={setIsObjectiveModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl uppercase">CHOISIR UN OBJECTIF</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => {
                  handleUpdateBaseInfo({ objective: prog.id });
                  setIsObjectiveModalOpen(false);
                }}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  tempProfile.objective === prog.id
                    ? "bg-primary/10 border-primary text-white"
                    : "bg-[#0F0F0F] border-transparent text-zinc-600"
                )}
              >
                <span className="text-3xl">{prog.emoji}</span>
                <span className="font-bold text-[10px] uppercase text-center tracking-tight">{prog.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Day Swap Modal */}
      <Dialog open={!!selectedDayToSwap} onOpenChange={() => setSelectedDayToSwap(null)}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl uppercase">ÉCHANGER AVEC...</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {dayNamesFull.filter(d => d !== selectedDayToSwap).map((day) => (
              <button
                key={day}
                onClick={() => swapDays(selectedDayToSwap!, day)}
                className="w-full p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-left hover:border-primary transition-all flex justify-between items-center"
              >
                <span className="font-headline text-xl text-white uppercase">{day}</span>
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  {currentProgram.sessions.find(s => s.id === schedule[day])?.name || "Repos"}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
