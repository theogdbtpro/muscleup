
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

const PROGRAM_STYLES: Record<string, { shadow: string }> = {
  'gros-bras': { shadow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]' },
  'pectoraux': { shadow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]' },
  'dos-large': { shadow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]' },
  'full-body': { shadow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]' },
  'jambes': { shadow: 'drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]' },
  'abdos': { shadow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]' },
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

  function generateOptimizedSchedule(freq: string, objId: string) {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const nbSessions = freq === "2j" ? 2 : freq === "3j" ? 3 : freq === "4j" ? 4 : 5;
    const program = PROGRAMS.find(p => p.id === objId) || PROGRAMS[0];
    const sessionIds = program.sessions.filter(s => !s.isRestDay).map(s => s.id);

    const newSchedule: Record<string, string | null> = {};
    days.forEach(d => { newSchedule[d] = null; });

    const step = days.length / nbSessions;
    for (let i = 0; i < nbSessions; i++) {
      const dayIdx = Math.min(Math.floor(i * step), days.length - 1);
      newSchedule[days[dayIdx]] = sessionIds[i % sessionIds.length];
    }
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
    toast({ title: "Planning ré-optimisé ✓" });
  };

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    localStorage.setItem("muscleup_base_schedule" + uidPrefix, JSON.stringify(schedule));
    localStorage.setItem("muscleup_schedule" + uidPrefix, JSON.stringify(schedule));
    toast({
      title: "Programme mis à jour !",
      description: "Tes réglages ont été synchronisés.",
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

  const handleResetName = (id: string) => {
    const newNames = { ...customNames };
    delete newNames[id];
    setCustomNames(newNames);
    localStorage.setItem("muscleup_session_names" + uidPrefix, JSON.stringify(newNames));
  };

  const moveSession = (day: string, direction: 'up' | 'down') => {
    const index = dayNamesFull.indexOf(day);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dayNamesFull.length) return;

    const targetDay = dayNamesFull[targetIndex];
    const newSchedule = { ...schedule };
    const tmp = newSchedule[day];
    newSchedule[day] = newSchedule[targetDay];
    newSchedule[targetDay] = tmp;

    setSchedule(newSchedule);
    setMoveMessage(`Séance déplacée le ${targetDay} ✓`);
    setTimeout(() => setMoveMessage(null), 2000);
  };

  const currentProgram = PROGRAMS.find(p => p.id === tempProfile.objective) || PROGRAMS[0];

  return (
    <div className="min-h-full bg-[#0F0F0F] flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-500">
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
          <button onClick={() => setIsObjectiveModalOpen(true)} className="w-full p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <span className={cn("text-4xl transition-transform group-active:scale-90", PROGRAM_STYLES[currentProgram.id]?.shadow)}>
                {currentProgram.emoji}
              </span>
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
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Planning hebdomadaire</h2>
            </div>
            {moveMessage && <span className="text-[9px] font-bold text-green-500 uppercase">{moveMessage}</span>}
          </div>

          <div className="space-y-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {dayNamesFull.map((day, idx) => {
              const sessionId = schedule[day];
              const session = currentProgram.sessions.find(s => s.id === sessionId);
              const displayName = session ? (customNames[session.id] || session.name) : "Repos";

              return (
                <div key={day} className="p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-xs font-bold w-12 text-zinc-600">{day}</span>
                    <div className="flex-1 flex items-center gap-2">
                      {editingId === session?.id ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveCustomName(session!.id)}
                            onBlur={() => setEditingId(null)}
                            className="h-8 bg-[#0F0F0F] border-[#E24B4A] text-sm"
                          />
                          <button onClick={() => handleSaveCustomName(session!.id)} className="text-green-500 p-1"><Check className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <>
                          <span className={cn("text-sm font-bold uppercase", session ? "text-white" : "text-zinc-800")}>{displayName}</span>
                          {session && (
                            <button onClick={() => { setEditingId(session.id); setEditValue(customNames[session.id] || session.name); }} className="text-zinc-600 hover:text-primary">
                              <Pencil className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {sessionId && !editingId && (
                    <div className="flex gap-1 ml-2">
                      <button disabled={idx === 0} onClick={() => moveSession(day, 'up')} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2A2A2A] text-zinc-500 hover:text-white disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                      <button disabled={idx === 6} onClick={() => moveSession(day, 'down')} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2A2A2A] text-zinc-500 hover:text-white disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
            {PROGRAMS.map((prog) => {
              const style = PROGRAM_STYLES[prog.id] || { shadow: '' };
              return (
                <button key={prog.id} onClick={() => { handleUpdateBaseInfo({ objective: prog.id }); setIsObjectiveModalOpen(false); }}
                  className={cn("p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                    tempProfile.objective === prog.id ? "bg-primary/10 border-primary" : "bg-[#0F0F0F] border-transparent hover:bg-zinc-800")}>
                  <span className={cn("text-4xl transition-transform group-active:scale-90", style.shadow)}>
                    {prog.emoji}
                  </span>
                  <span className={cn(
                    "font-bold text-[10px] uppercase text-center tracking-widest",
                    tempProfile.objective === prog.id ? "text-white" : "text-zinc-600"
                  )}>
                    {prog.name}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
