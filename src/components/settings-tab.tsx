
"use client";

import { useState, useMemo, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { PROGRAMS } from "@/data/programs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, Target, Award, Calendar, Repeat, CheckCircle, AlertTriangle, Sparkles, MapPin, ChevronUp, ChevronDown, Pencil, RotateCcw, Check, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";

type SettingsTabProps = {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
};

const PROGRAM_STYLES: Record<string, { shadow: string, glow: string }> = {
  'gros-bras': { shadow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
  'pectoraux': { shadow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
  'dos-large': { shadow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  'full-body': { shadow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]' },
  'jambes': { shadow: 'drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' },
  'abdos': { shadow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
};

export default function SettingsTab({ profile, onUpdateProfile, onBack }: SettingsTabProps) {
  const { toast } = useToast();
  const [tempProfile, setTempProfile] = useState<UserProfile>({ ...profile });
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [moveMessage, setMoveMessage] = useState<string | null>(null);
  
  const user = auth.currentUser;
  const uidPrefix = user ? `_${user.uid}` : "_guest";

  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const dayNamesFull = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  const [schedule, setSchedule] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const savedNames = localStorage.getItem("muscleup_session_names" + uidPrefix);
    if (savedNames) setCustomNames(JSON.parse(savedNames));

    const savedSchedule = localStorage.getItem("muscleup_base_schedule" + uidPrefix) || localStorage.getItem("muscleup_schedule" + uidPrefix);
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    } else {
      const generated = generateOptimizedSchedule(profile.frequency, profile.objective);
      setSchedule(generated);
    }
  }, [uidPrefix]);

  /**
   * Génère un planning optimisé en verrouillant les jours passés
   */
  function generateOptimizedSchedule(freq: string, objId: string, currentSchedule?: Record<string, string | null>) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const todayIdx = (new Date().getDay() + 6) % 7; // 0=Lundi, 6=Dimanche
    const nbSessions = freq === "2j" ? 2 : freq === "3j" ? 3 : freq === "4j" ? 4 : 5;
    const program = PROGRAMS.find(p => p.id === objId) || PROGRAMS[0];
    const sessionIds = program.sessions.filter(s => !s.isRestDay).map(s => s.id);

    const newSchedule: Record<string, string | null> = {};
    
    // 1. Verrouiller les jours passés si un planning existe déjà
    if (currentSchedule) {
      days.forEach((d, idx) => {
        if (idx < todayIdx) {
          newSchedule[d] = currentSchedule[d];
        } else {
          newSchedule[d] = null;
        }
      });
    } else {
      days.forEach(d => { newSchedule[d] = null; });
    }

    // 2. Calculer combien de sessions il reste à placer pour la fin de semaine
    const pastSessionsCount = days.slice(0, todayIdx).filter(d => currentSchedule?.[d]).length;
    const remainingSessionsToPlace = Math.max(0, nbSessions - pastSessionsCount);
    
    const remainingDays = days.slice(todayIdx);
    
    if (remainingDays.length > 0 && remainingSessionsToPlace > 0) {
      const step = remainingDays.length / remainingSessionsToPlace;
      for (let i = 0; i < remainingSessionsToPlace; i++) {
        const dayIdxInRemaining = Math.min(Math.floor(i * step), remainingDays.length - 1);
        const dayName = remainingDays[dayIdxInRemaining];
        // On évite d'écraser si le jour est déjà rempli par un verrou (normalement pas possible ici mais sécurité)
        if (!newSchedule[dayName]) {
          newSchedule[dayName] = sessionIds[(i + pastSessionsCount) % sessionIds.length];
        }
      }
    }

    return newSchedule;
  }

  const handleUpdateBaseInfo = (updates: Partial<UserProfile>) => {
    const newProfile = { ...tempProfile, ...updates };
    setTempProfile(newProfile);
    
    // Si la fréquence ou l'objectif change, on régénère intelligemment
    if (updates.frequency || updates.objective) {
      const newSchedule = generateOptimizedSchedule(
        updates.frequency || tempProfile.frequency,
        updates.objective || tempProfile.objective,
        schedule // On passe le planning actuel pour verrouiller le passé
      );
      setSchedule(newSchedule);
      toast({ 
        title: "Planning mis à jour", 
        description: "Tes séances passées ont été conservées." 
      });
    }
  };

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    localStorage.setItem("muscleup_base_schedule" + uidPrefix, JSON.stringify(schedule));
    localStorage.setItem("muscleup_schedule" + uidPrefix, JSON.stringify(schedule));
    toast({
      title: "Profil sauvegardé !",
      description: "Tes réglages sont maintenant actifs.",
    });
    setTimeout(() => onBack(), 800);
  };

  const handleSaveCustomName = (id: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const newNames = { ...customNames, [id]: trimmed };
    setCustomNames(newNames);
    localStorage.setItem("muscleup_session_names" + uidPrefix, JSON.stringify(newNames));
    setEditingId(null);
  };

  const moveSession = (day: string, direction: 'up' | 'down') => {
    const index = dayNamesFull.indexOf(day);
    const todayIdx = (new Date().getDay() + 6) % 7;
    
    // Interdire de déplacer une séance passée
    if (index < todayIdx) {
      toast({ variant: "destructive", title: "Action impossible", description: "Tu ne peux pas déplacer une séance passée." });
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < todayIdx || targetIndex >= dayNamesFull.length) return;

    const targetDay = dayNamesFull[targetIndex];
    const newSchedule = { ...schedule };
    const tmp = newSchedule[day];
    newSchedule[day] = newSchedule[targetDay];
    newSchedule[targetDay] = tmp;

    setSchedule(newSchedule);
    setMoveMessage(`Déplacé le ${targetDay} ✓`);
    setTimeout(() => setMoveMessage(null), 2000);
  };

  const currentProgram = PROGRAMS.find(p => p.id === tempProfile.objective) || PROGRAMS[0];

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-500 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-headline text-white tracking-tight uppercase">PARAMÈTRES</h1>
        </div>
        <button 
          onClick={() => { if(confirm("Se déconnecter ?")) auth.signOut(); }}
          className="p-2 text-zinc-600 hover:text-primary transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="space-y-10 flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Lieu */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lieu d'entraînement</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleUpdateBaseInfo({ location: 'salle' })}
              className={cn("p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase gap-2",
                tempProfile.location === 'salle' ? "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(226,75,74,0.2)]" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
              🏋️ Salle
            </button>
            <button onClick={() => handleUpdateBaseInfo({ location: 'maison' })}
              className={cn("p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase gap-2",
                tempProfile.location === 'maison' ? "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(226,75,74,0.2)]" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
              🏠 Maison
            </button>
          </div>
        </section>

        {/* Objectif Néon */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Objectif actuel</h2>
          </div>
          <button onClick={() => setIsObjectiveModalOpen(true)} 
            className={cn("w-full p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[32px] flex justify-between items-center group transition-all", PROGRAM_STYLES[currentProgram.id]?.glow)}>
            <div className="flex items-center gap-4">
              <span className={cn("text-5xl transition-transform group-active:scale-90", PROGRAM_STYLES[currentProgram.id]?.shadow)}>
                {currentProgram.emoji}
              </span>
              <span className="font-headline text-2xl text-white uppercase">{currentProgram.name}</span>
            </div>
            <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Modifier</span>
          </button>
        </section>

        {/* Niveau */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Niveau d'expérience</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
              <button key={l} onClick={() => handleUpdateBaseInfo({ level: l })}
                className={cn("p-4 rounded-xl border-2 transition-all flex justify-center items-center text-[10px] font-bold uppercase",
                  tempProfile.level === l ? "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(226,75,74,0.2)]" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* Fréquence */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fréquence hebdomadaire</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["2j", "3j", "4j", "5j"].map((f) => (
              <button key={f} onClick={() => handleUpdateBaseInfo({ frequency: f })}
                className={cn("h-16 rounded-xl border-2 transition-all flex items-center justify-center font-headline text-2xl",
                  tempProfile.frequency === f ? "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(226,75,74,0.2)]" : "bg-[#1A1A1A] border-transparent text-zinc-600")}>
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Planning Hebdo */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Planning verrouillé</h2>
            </div>
            {moveMessage && <span className="text-[9px] font-bold text-green-500 uppercase animate-pulse">{moveMessage}</span>}
          </div>

          <div className="space-y-1 bg-[#1A1A1A]/30 border border-[#2A2A2A] rounded-[32px] overflow-hidden">
            {dayNamesFull.map((day, idx) => {
              const sessionId = schedule[day];
              const session = currentProgram.sessions.find(s => s.id === sessionId);
              const displayName = session ? (customNames[session.id] || session.name) : "REPOS";
              const todayIdx = (new Date().getDay() + 6) % 7;
              const isPast = idx < todayIdx;

              return (
                <div key={day} className={cn("p-5 flex items-center justify-between border-b border-[#2A2A2A] last:border-0", isPast ? "bg-black/40 opacity-50" : "bg-[#1A1A1A]/40")}>
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-12 shrink-0">
                      <span className={cn("text-[10px] font-black uppercase block", isPast ? "text-zinc-700" : "text-zinc-500")}>{day}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3 truncate">
                      {editingId === session?.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveCustomName(session!.id)}
                            onBlur={() => setEditingId(null)}
                            className="h-8 bg-black border-primary text-white font-headline text-lg uppercase"
                          />
                        </div>
                      ) : (
                        <>
                          <span className={cn("text-xl font-headline uppercase truncate", session ? "text-white" : "text-zinc-800")}>{displayName}</span>
                          {session && !isPast && (
                            <button onClick={() => { setEditingId(session.id); setEditValue(customNames[session.id] || session.name); }} className="text-zinc-700 hover:text-primary transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {sessionId && !editingId && !isPast && (
                    <div className="flex gap-1.5 ml-3">
                      <button disabled={idx === todayIdx} onClick={() => moveSession(day, 'up')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500 hover:text-white disabled:opacity-0 transition-all"><ChevronUp className="w-4 h-4" /></button>
                      <button disabled={idx === 6} onClick={() => moveSession(day, 'down')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500 hover:text-white disabled:opacity-0 transition-all"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                  )}
                  {isPast && (
                    <div className="text-[10px] font-black text-zinc-800 uppercase tracking-tighter italic">Verrouillé</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 pt-4 pb-4 bg-[#0F0F0F] z-20">
        <Button onClick={handleSave} className="w-full h-16 rounded-[24px] text-2xl font-headline bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          APPLIQUER LES CHANGEMENTS ✓
        </Button>
      </div>

      {/* Modal Objectifs avec Emojis Néon */}
      <Dialog open={isObjectiveModalOpen} onOpenChange={setIsObjectiveModalOpen}>
        <DialogContent className="bg-[#0F0F0F] border-[#2A2A2A] text-white p-8 rounded-[40px] max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-center uppercase tracking-tight mb-6">Nouvel Objectif</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {PROGRAMS.map((prog) => {
              const style = PROGRAM_STYLES[prog.id] || { shadow: '', glow: '' };
              const isSelected = tempProfile.objective === prog.id;
              return (
                <button key={prog.id} onClick={() => { handleUpdateBaseInfo({ objective: prog.id }); setIsObjectiveModalOpen(false); }}
                  className={cn("p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                    isSelected ? "bg-primary/10 border-primary" : "bg-[#1A1A1A] border-transparent hover:bg-zinc-800")}>
                  <span className={cn("text-5xl transition-transform group-active:scale-90", style.shadow)}>
                    {prog.emoji}
                  </span>
                  <span className={cn(
                    "font-bold text-[10px] uppercase text-center tracking-widest leading-tight",
                    isSelected ? "text-white" : "text-zinc-600"
                  )}>
                    {prog.name}
                  </span>
                  {isSelected && <div className={cn("absolute inset-0 pointer-events-none opacity-20", style.glow)} />}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
