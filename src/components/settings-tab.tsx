"use client";

import { useState, useMemo } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Target, Award, Calendar, Repeat, ArrowRightLeft, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type SettingsTabProps = {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
};

export default function SettingsTab({ profile, onUpdateProfile, onBack }: SettingsTabProps) {
  const { toast } = useToast();
  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [selectedDayToMove, setSelectedDayToMove] = useState<string | null>(null);
  const [pendingTargetDay, setPendingTargetDay] = useState<string | null>(null);
  const [moveMessage, setMoveMessage] = useState<string | null>(null);

  const dayNamesFull = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const isHighFrequency = tempProfile.frequency === "4j" || tempProfile.frequency === "5j";

  const [schedule, setSchedule] = useState<Record<string, string | null>>(() => {
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    return generateOptimizedSchedule(profile.frequency, profile.objective);
  });

  const currentProgram = PROGRAMS.find(p => p.id === tempProfile.objective) || PROGRAMS[0];

  function generateOptimizedSchedule(freq: string, objId: string) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const selectedDays: string[] = [];
    if (freq === "2j") selectedDays.push("Lundi", "Jeudi");
    else if (freq === "3j") selectedDays.push("Lundi", "Mercredi", "Vendredi");
    else if (freq === "4j") selectedDays.push("Lundi", "Mardi", "Jeudi", "Vendredi");
    else if (freq === "5j") selectedDays.push("Lundi", "Mardi", "Mercredi", "Vendredi", "Samedi");
    
    const program = PROGRAMS.find(p => p.id === objId) || PROGRAMS[0];
    const sessionIds = program.sessions.filter(s => !s.isRestDay).map(s => s.id);
    const newSchedule: Record<string, string | null> = {};
    days.forEach(d => newSchedule[d] = null);
    selectedDays.forEach((day, idx) => {
      newSchedule[day] = sessionIds[idx % sessionIds.length];
    });
    return newSchedule;
  }

  const handleUpdateBaseInfo = (updates: Partial<UserProfile>) => {
    const newProfile = { ...tempProfile, ...updates };
    setTempProfile(newProfile);
    if (updates.frequency || updates.objective) {
      const newSchedule = generateOptimizedSchedule(
        updates.frequency || tempProfile.frequency,
        updates.objective || tempProfile.objective
      );
      setSchedule(newSchedule);
    }
  };

  const handleReoptimize = () => {
    const newSchedule = generateOptimizedSchedule(tempProfile.frequency, tempProfile.objective);
    setSchedule(newSchedule);
    toast({
      title: "Planning ré-optimisé ✓",
      description: "Récupération maximale configurée.",
    });
  };

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    localStorage.setItem("muscleup_schedule", JSON.stringify(schedule));
    toast({
      title: "Programme mis à jour !",
      description: "Tes modifications ont été enregistrées avec succès.",
    });
    setTimeout(() => onBack(), 1000);
  };

  const checkAdjacency = (targetDay: string) => {
    if (isHighFrequency) return false;
    const targetIdx = dayNamesFull.indexOf(targetDay);
    const prevDay = dayNamesFull[(targetIdx + 6) % 7];
    const nextDay = dayNamesFull[(targetIdx + 1) % 7];
    
    const isPrevTraining = !!schedule[prevDay] && prevDay !== selectedDayToMove;
    const isNextTraining = !!schedule[nextDay] && nextDay !== selectedDayToMove;
    
    return isPrevTraining || isNextTraining;
  };

  const handleDayClick = (targetDay: string) => {
    if (checkAdjacency(targetDay)) {
      setPendingTargetDay(targetDay);
    } else {
      executeMove(targetDay);
    }
  };

  const executeMove = (targetDay: string) => {
    if (!selectedDayToMove) return;
    const newSchedule = { ...schedule };
    const sourceSession = newSchedule[selectedDayToMove];
    const targetSession = newSchedule[targetDay];
    newSchedule[targetDay] = sourceSession;
    newSchedule[selectedDayToMove] = targetSession;

    setSchedule(newSchedule);
    setSelectedDayToMove(null);
    setPendingTargetDay(null);
    setMoveMessage("Séance déplacée ✓");
    setTimeout(() => setMoveMessage(null), 3000);
  };

  const handleAutoOptimizeMove = () => {
    if (!selectedDayToMove) return;
    
    // Find the first free day that is not adjacent to any other workout
    let optimizedDay = null;
    for (const day of dayNamesFull) {
      if (!schedule[day] && day !== selectedDayToMove) {
        // Check adjacency of this potential day
        const idx = dayNamesFull.indexOf(day);
        const prev = dayNamesFull[(idx + 6) % 7];
        const next = dayNamesFull[(idx + 1) % 7];
        if (!schedule[prev] && !schedule[next]) {
          optimizedDay = day;
          break;
        }
      }
    }

    if (optimizedDay) {
      executeMove(optimizedDay);
      toast({ title: "Optimisé ✨", description: `Séance placée le ${optimizedDay}` });
    } else {
      toast({ title: "Aucun jour idéal", description: "Déplacement manuel requis.", variant: "destructive" });
      setPendingTargetDay(null);
    }
  };

  const optimizationWarnings = useMemo(() => {
    if (isHighFrequency) return [];
    const warnings: string[] = [];
    for (let i = 0; i < dayNamesFull.length; i++) {
      const today = dayNamesFull[i];
      const tomorrow = dayNamesFull[(i + 1) % dayNamesFull.length];
      if (schedule[today] && schedule[tomorrow]) {
        warnings.push(`Repos limité entre ${today} et ${tomorrow}.`);
      }
    }
    return warnings;
  }, [schedule, isHighFrequency]);

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-headline text-white tracking-tight uppercase">PARAMÈTRES</h1>
      </header>

      <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pb-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Objectif actuel</h2>
          </div>
          <button onClick={() => setIsObjectiveModalOpen(true)} className="w-full p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{currentProgram.emoji}</span>
              <span className="font-headline text-2xl text-white uppercase">{currentProgram.name}</span>
            </div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Changer</span>
          </button>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Niveau d'expérience</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
              <button key={l} onClick={() => handleUpdateBaseInfo({ level: l })}
                className={cn("p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase",
                  tempProfile.level === l ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
                {l}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fréquence hebdomadaire</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["2j", "3j", "4j", "5j"].map((f) => (
              <button key={f} onClick={() => handleUpdateBaseInfo({ frequency: f })}
                className={cn("h-16 rounded-xl border-2 transition-all flex items-center justify-center font-headline text-2xl",
                  tempProfile.frequency === f ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Planning de la semaine</h2>
            </div>
            {moveMessage && (
              <div className="flex items-center gap-1.5 text-green-500 animate-in fade-in">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase">{moveMessage}</span>
              </div>
            )}
          </div>

          {!isHighFrequency && (
            <button 
              onClick={handleReoptimize}
              className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-primary/50 text-primary rounded-xl text-xs font-bold uppercase hover:bg-primary/5 transition-all mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Ré-optimiser automatiquement
            </button>
          )}

          <div className="space-y-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {dayNamesFull.map((day, idx) => {
              const sessionId = schedule[day];
              const session = currentProgram.sessions.find(s => s.id === sessionId);
              
              const prevDay = dayNamesFull[(idx + 6) % 7];
              const nextDay = dayNamesFull[(idx + 1) % 7];
              const hasAdjacencyIssue = !isHighFrequency && !!sessionId && (!!schedule[prevDay] || !!schedule[nextDay]);

              return (
                <div key={day} className="p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold w-12 text-zinc-600">{day}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-bold uppercase tracking-tight", session ? "text-white" : "text-zinc-700")}>
                        {session ? session.name : "Repos"}
                      </span>
                      {hasAdjacencyIssue && (
                        <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center">
                          <span className="text-amber-500 text-[10px] font-bold">!</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelectedDayToMove(day)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
          
          {!isHighFrequency && (
            <p className="text-[10px] text-zinc-500 italic text-center mt-2">
              Clique sur ✨ pour que l'IA replace tes séances aux jours les plus optimaux pour ta récupération
            </p>
          )}

          {optimizationWarnings.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Avertissement Récupération</span>
              </div>
              <p className="text-[10px] text-amber-200/70 italic leading-tight">
                ⚠️ Attention : pas assez de repos entre certaines séances. Idéalement 48h minimum.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="sticky bottom-0 pt-4 bg-[#0F0F0F] z-20">
        <Button onClick={handleSave} className="w-full h-16 rounded-xl text-xl font-headline bg-primary text-white shadow-xl shadow-primary/20">
          SAUVEGARDER MON PROGRAMME ✓
        </Button>
      </div>

      <Dialog open={isObjectiveModalOpen} onOpenChange={setIsObjectiveModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl uppercase">CHOISIR UN OBJECTIF</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {PROGRAMS.map((prog) => (
              <button key={prog.id} onClick={() => { handleUpdateBaseInfo({ objective: prog.id }); setIsObjectiveModalOpen(false); }}
                className={cn("p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  tempProfile.objective === prog.id ? "bg-primary/10 border-primary text-white" : "bg-[#0F0F0F] border-transparent text-zinc-600")}>
                <span className="text-3xl">{prog.emoji}</span>
                <span className="font-bold text-[10px] uppercase text-center tracking-tight">{prog.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedDayToMove} onOpenChange={() => { setSelectedDayToMove(null); setPendingTargetDay(null); }}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl uppercase">DÉPLACER VERS...</DialogTitle>
          </DialogHeader>
          
          {pendingTargetDay ? (
            <div className="space-y-6 mt-4 animate-in zoom-in-95">
              <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-amber-200 uppercase tracking-tight">
                  ⚠️ Séances consécutives — pas idéal pour la récupération
                </p>
                <p className="text-xs text-amber-500/70 italic">
                  Pour 2-3 séances/semaine, 48h de repos entre chaque séance maximise tes gains.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => executeMove(pendingTargetDay)} className="h-14 bg-white hover:bg-white/90 text-[#0F0F0F] font-headline text-xl rounded-xl">
                  CONFIRMER CE JOUR
                </Button>
                <Button onClick={handleAutoOptimizeMove} className="h-14 bg-primary hover:bg-primary/90 text-white font-headline text-xl rounded-xl flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> OPTIMISER AUTOMATIQUEMENT
                </Button>
                <Button onClick={() => setPendingTargetDay(null)} variant="ghost" className="h-14 text-zinc-500 font-headline text-xl">
                  ANNULER
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 mt-4">
              {dayNamesFull.filter(d => d !== selectedDayToMove).map((day) => {
                const isOccupied = !!schedule[day];
                return (
                  <button key={day} onClick={() => handleDayClick(day)}
                    className="w-full p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-left hover:border-primary transition-all flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-headline text-xl text-white uppercase">{day}</span>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {schedule[day] ? currentProgram.sessions.find(s => s.id === schedule[day])?.name : "Repos"}
                      </span>
                    </div>
                    <span className={cn("text-[8px] font-bold uppercase px-2 py-1 rounded-full",
                      isOccupied ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500")}>
                      {isOccupied ? "Occupé" : "Disponible"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
