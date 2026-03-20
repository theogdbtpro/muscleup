
"use client";

import { useState, useMemo, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Target, Award, Calendar, Repeat, CheckCircle, AlertTriangle, Sparkles, MapPin, ChevronUp, ChevronDown, Pencil, RotateCcw, Check } from "lucide-react";
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
  const [moveMessage, setMoveMessage] = useState<string | null>(null);
  
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const dayNamesFull = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const isHighFrequency = tempProfile.frequency === "4j" || tempProfile.frequency === "5j";

  const [schedule, setSchedule] = useState<Record<string, string | null>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("muscleup_schedule");
      if (saved) return JSON.parse(saved);
    }
    return generateOptimizedSchedule(profile.frequency, profile.objective);
  });

  useEffect(() => {
    const savedNames = localStorage.getItem("muscleup_session_names");
    if (savedNames) setCustomNames(JSON.parse(savedNames));
  }, []);

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

  const handleSaveCustomName = (id: string) => {
    if (!editValue.trim()) {
      setEditingId(null);
      return;
    }
    const newNames = { ...customNames, [id]: editValue };
    setCustomNames(newNames);
    localStorage.setItem("muscleup_session_names", JSON.stringify(newNames));
    setEditingId(null);
    toast({ title: "Nom mis à jour ✓" });
  };

  const handleResetName = (id: string) => {
    const newNames = { ...customNames };
    delete newNames[id];
    setCustomNames(newNames);
    localStorage.setItem("muscleup_session_names", JSON.stringify(newNames));
    toast({ title: "Nom réinitialisé" });
  };

  const moveSession = (day: string, direction: 'up' | 'down') => {
    const index = dayNamesFull.indexOf(day);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dayNamesFull.length) return;

    const targetDay = dayNamesFull[targetIndex];
    const newSchedule = { ...schedule };
    const currentSession = newSchedule[day];
    const targetSession = newSchedule[targetDay];

    newSchedule[targetDay] = currentSession;
    newSchedule[day] = targetSession;

    setSchedule(newSchedule);
    setMoveMessage(`Séance déplacée le ${targetDay} ✓`);
    setTimeout(() => setMoveMessage(null), 2000);
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
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lieu d'entraînement</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleUpdateBaseInfo({ location: 'salle' })}
              className={cn("p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase gap-2",
                tempProfile.location === 'salle' ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
              🏋️ Salle
            </button>
            <button onClick={() => handleUpdateBaseInfo({ location: 'maison' })}
              className={cn("p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase gap-2",
                tempProfile.location === 'maison' ? "bg-primary/10 border-primary text-white" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
              🏠 Maison
            </button>
          </div>
        </section>

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
          <div className="flex items-center justify-between mb-2">
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

              const displayName = session ? (customNames[session.id] || session.name) : "Repos";
              const isCustom = session && customNames[session.id];

              return (
                <div 
                  key={day}
                  className="p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-xs font-bold w-12 text-zinc-600">{day}</span>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2">
                        {editingId === session?.id ? (
                          <div className="flex items-center gap-1 flex-1 max-w-[200px]">
                            <Input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveCustomName(session!.id)}
                              onBlur={() => setEditingId(null)}
                              className="h-8 bg-[#0F0F0F] border-[#E24B4A] text-sm py-1"
                            />
                            <button onClick={() => handleSaveCustomName(session!.id)} className="p-1.5 text-green-500">
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-bold uppercase tracking-tight", session ? "text-white" : "text-zinc-700")}>
                              {displayName}
                            </span>
                            {session && (
                              <button 
                                onClick={() => { setEditingId(session.id); setEditValue(customNames[session.id] || session.name); }} 
                                className="p-1 text-zinc-600 hover:text-primary transition-colors"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            )}
                            {isCustom && (
                              <button 
                                onClick={() => handleResetName(session.id)} 
                                className="p-1 text-zinc-600 hover:text-amber-500 transition-colors"
                                title="Réinitialiser le nom"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                        {hasAdjacencyIssue && (
                          <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <span className="text-amber-500 text-[10px] font-bold">!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {sessionId && !editingId && (
                    <div className="flex gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSession(day, 'up')}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2A2A2A] text-zinc-500 hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-[#2A2A2A] disabled:hover:text-zinc-500 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === 6}
                        onClick={() => moveSession(day, 'down')}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2A2A2A] text-zinc-500 hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-[#2A2A2A] disabled:hover:text-zinc-500 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest text-center">
            💡 Astuce : utilise le crayon pour renommer tes séances
          </p>

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
    </div>
  );
}
