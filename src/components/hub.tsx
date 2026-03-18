"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS, Session } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Activity, Utensils, MessageSquare, Lightbulb, CheckCircle2, Circle, ChevronRight, Clock, Dumbbell } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
  onStartSession: (sessionId?: string) => void;
};

const OBJECTIVE_TIPS: Record<string, string> = {
  "gros-bras": "Focus sur la contraction volontaire, ne balance pas les charges !",
  "pectoraux": "Garde les omoplates serrées sur le banc pour protéger tes épaules.",
  "dos-large": "Imagine que tu tires avec tes coudes, pas avec tes mains.",
  "full-body": "Priorise les mouvements polyarticulaires pour brûler plus de calories.",
  "jambes": "Descends au moins jusqu'à la parallèle pour engager les fessiers.",
  "abdos": "La sangle abdominale se forge aussi dans l'assiette, reste hydraté."
};

export default function Hub({ profile, setView, onStartSession }: HubProps) {
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [isSessionPickerOpen, setIsSessionPickerOpen] = useState(false);
  const [selectedPreviewSession, setSelectedPreviewSession] = useState<{session: Session, day: string} | null>(null);

  const program = useMemo(() => {
    return PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0];
  }, [profile.objective]);

  const dayNamesFull = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const currentDayIdx = (new Date().getDay() + 6) % 7;
  const todayName = dayNamesFull[currentDayIdx];

  useEffect(() => {
    const savedHistory = localStorage.getItem("muscleup_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedDates = localStorage.getItem("completedDates");
    if (savedDates) setCompletedDates(JSON.parse(savedDates));
  }, []);

  const finishedToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return completedDates.includes(todayStr);
  }, [completedDates]);

  const streak = useMemo(() => {
    const dates = Array.from(new Set(completedDates)).sort().reverse();
    if (dates.length === 0) return 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (dates[0] !== today && dates[0] !== yesterdayStr) return 0;
    let count = 0;
    let checkDate = dates[0] === today ? new Date() : yesterday;
    while (dates.includes(checkDate.toISOString().split('T')[0])) {
      count++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return count;
  }, [completedDates]);

  const [schedule, setSchedule] = useState<Record<string, string | null>>(() => {
    const saved = localStorage.getItem("muscleup_schedule");
    if (saved) return JSON.parse(saved);
    const mapping: Record<string, string | null> = {};
    dayNamesFull.forEach(d => {
      const s = program.sessions.find(ps => ps.day === d);
      mapping[d] = s ? s.id : null;
    });
    return mapping;
  });

  const todaySessionId = schedule[todayName];
  const todaySession = program.sessions.find(s => s.id === todaySessionId);

  const dayStatuses = useMemo(() => {
    const statuses = new Array(7).fill("upcoming");
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);
    monday.setHours(0,0,0,0);
    history.forEach(h => {
      if (!h.date) return;
      const hDate = new Date(h.date);
      if (hDate >= monday) {
        const dayIdx = (hDate.getDay() + 6) % 7;
        statuses[dayIdx] = "done";
      }
    });
    return statuses;
  }, [history, currentDayIdx]);

  const weeklySessionsDone = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);
    monday.setHours(0,0,0,0);
    return history.filter(h => h.date && new Date(h.date) >= monday).length;
  }, [history, currentDayIdx]);

  const totalWeeklyGoal = parseInt(profile.frequency) || 3;
  const weeklyProgressPercent = Math.min((weeklySessionsDone / totalWeeklyGoal) * 100, 100);

  const handlePostpone = () => {
    if (!todaySession) return;
    let nextAvailableDayIdx = -1;
    for (let i = currentDayIdx + 1; i < 7; i++) {
      if (!schedule[dayNamesFull[i]]) {
        nextAvailableDayIdx = i;
        break;
      }
    }
    if (nextAvailableDayIdx !== -1) {
      const nextDayName = dayNamesFull[nextAvailableDayIdx];
      const newSchedule = { ...schedule };
      newSchedule[nextDayName] = todaySessionId;
      newSchedule[todayName] = null;
      setSchedule(newSchedule);
      localStorage.setItem("muscleup_schedule", JSON.stringify(newSchedule));
      toast({ title: `Séance reportée au ${nextDayName} ✓`, description: "Ton planning a été mis à jour." });
    } else {
      toast({ title: "Impossible de reporter", description: "Aucun jour de repos disponible cette semaine.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline text-white leading-none">
            {profile.name ? `Bonjour ${profile.name} !` : "Bonjour !"}
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Forger ton corps, maintenant.</p>
        </div>
        <div className="bg-[#E24B4A]/10 px-4 py-2 rounded-full flex items-center gap-2 border border-[#E24B4A]/20">
          <Flame className="w-4 h-4 text-[#E24B4A] fill-[#E24B4A]" />
          <span className="text-sm font-bold text-white tracking-tighter">{streak} JOURS</span>
        </div>
      </header>

      <button onClick={() => setView("settings")} className="w-full bg-[#1A1A1A] p-[10px_14px] rounded-[10px] flex items-center justify-between border border-transparent hover:border-[#2A2A2A] transition-all">
        <div className="flex items-center gap-2">
          <span className="text-base">{program.emoji}</span>
          <span className="text-[12px] font-bold text-zinc-300 uppercase tracking-tight">
            {program.name} · {profile.level} · {profile.frequency}/sem
          </span>
        </div>
        <div className="bg-[#E24B4A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
          Modifier <ChevronRight className="w-3 h-3" />
        </div>
      </button>

      <Card className={cn("p-8 rounded-2xl border-none relative overflow-hidden shadow-2xl transition-all", finishedToday ? "bg-[#1A4A2A]" : "bg-[#E24B4A]")}>
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", finishedToday ? "text-green-400" : "text-white/70")}>
              {finishedToday ? "Bravo !" : "Séance du jour"}
            </h3>
            <h4 className="text-4xl font-headline text-white leading-tight uppercase">
              {finishedToday ? "SÉANCE TERMINÉE ✓" : (todaySession ? todaySession.name : "Repos aujourd'hui")}
            </h4>
            <p className={cn("font-medium text-sm", finishedToday ? "text-green-200" : "text-white/80")}>
              {finishedToday ? "Ton corps te remercie. Repose-toi bien !" : (todaySession ? `Durée estimée : ${todaySession.duration}` : "Profite pour bien récupérer.")}
            </p>
          </div>
          {!finishedToday && todaySession && (
            <Button onClick={() => onStartSession()} className="w-full h-14 bg-white text-[#E24B4A] rounded-xl text-lg font-headline hover:bg-white/90 shadow-xl">
              C'EST PARTI !
            </Button>
          )}
          {!finishedToday && (
            <div className="flex flex-col gap-3 mt-4">
              <button onClick={() => setIsSessionPickerOpen(true)} className="w-full text-center text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                Choisir une autre séance →
              </button>
              {todaySession && (
                <button onClick={handlePostpone} className="w-full text-center text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Reporter à demain →
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isSessionPickerOpen} onOpenChange={setIsSessionPickerOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">CHOISIR UNE SÉANCE</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {program.sessions.filter(s => !s.isRestDay).map((s) => (
              <button key={s.id} onClick={() => { onStartSession(s.id); setIsSessionPickerOpen(false); }}
                className="w-full p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-left hover:border-[#E24B4A] transition-all flex justify-between items-center group">
                <div>
                  <div className="font-headline text-xl uppercase">{s.name}</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.exercises.length} exercices • {s.duration}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E24B4A]/10 flex items-center justify-center group-hover:bg-[#E24B4A] transition-colors">
                  <Activity className="w-4 h-4 text-[#E24B4A] group-hover:text-white" />
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide">PROGRAMME DE LA SEMAINE</h2>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
          {dayNamesFull.map((dayName, idx) => {
            const sessionId = schedule[dayName];
            const session = program.sessions.find(s => s.id === sessionId);
            const isDone = dayStatuses[idx] === "done";
            const isToday = idx === currentDayIdx;
            const isRest = !session || session.isRestDay;
            
            return (
              <div 
                key={dayName} 
                onClick={() => !isRest && setSelectedPreviewSession({ session: session!, day: dayName })}
                className={cn(
                  "p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0 transition-colors", 
                  isToday ? "bg-[#E24B4A]/5" : "",
                  !isRest ? "cursor-pointer hover:bg-white/5" : ""
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn("text-xs font-bold w-20 flex-shrink-0", isToday ? "text-[#E24B4A]" : "text-zinc-600")}>
                    {dayName}
                  </span>
                  <span className={cn("text-sm font-bold uppercase tracking-tight", isToday ? "text-white" : isRest ? "text-zinc-700" : "text-zinc-400")}>
                    {isRest ? "Repos" : session.name}
                  </span>
                </div>
                {isDone ? <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" /> : isToday && !isRest ? <Circle className="w-4 h-4 text-[#E24B4A]" /> : <Circle className="w-4 h-4 text-zinc-800" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Session Preview Modal */}
      <Dialog open={!!selectedPreviewSession} onOpenChange={() => setSelectedPreviewSession(null)}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white p-0 overflow-hidden sm:rounded-t-3xl sm:rounded-b-none bottom-0 top-auto translate-y-0 left-0 right-0 max-w-full m-0 border-x-0 border-b-0 animate-in slide-in-from-bottom duration-300">
          {selectedPreviewSession && (
            <div className="p-6 space-y-6 pb-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-headline text-[#E24B4A] uppercase leading-none">{selectedPreviewSession.session.name}</h2>
                  <div className="flex items-center gap-3 mt-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>{selectedPreviewSession.day}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedPreviewSession.session.duration}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedPreviewSession(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </button>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar">
                {selectedPreviewSession.session.exercises.map((ex, i) => (
                  <div key={i} className="bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A] flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center font-headline text-xl text-zinc-600">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white uppercase tracking-tight">{ex.name}</div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{ex.sets} × {ex.reps}</span>
                        <span className="text-[10px] font-bold text-[#EE3BAA] uppercase tracking-tighter">{ex.muscle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                {selectedPreviewSession.day === todayName ? (
                  <Button 
                    onClick={() => { onStartSession(selectedPreviewSession.session.id); setSelectedPreviewSession(null); }}
                    className="w-full h-16 bg-[#E24B4A] hover:bg-[#E24B4A]/90 text-white font-headline text-2xl rounded-2xl shadow-xl shadow-[#E24B4A]/20"
                  >
                    C'EST PARTI !
                  </Button>
                ) : (
                  <Button disabled className="w-full h-16 bg-[#2A2A2A] text-zinc-500 font-headline text-2xl rounded-2xl border border-transparent">
                    PRÉVISUALISATION
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedPreviewSession(null)}
                  className="w-full text-zinc-500 font-bold uppercase text-xs tracking-widest"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setView("progres")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors">
          <Activity className="w-6 h-6 text-[#EE3BAA]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
        </button>
        <button onClick={() => setView("nutrition")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors">
          <Utensils className="w-6 h-6 text-[#E24B4A]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
        </button>
        <button onClick={() => setView("coach")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col items-center gap-3 hover:bg-[#2A2A2A] transition-colors">
          <MessageSquare className="w-6 h-6 text-green-500" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Coach IA</span>
        </button>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide">CONSEIL DU JOUR</h2>
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            "{OBJECTIVE_TIPS[profile.objective] || "Reste constant, les résultats viendront avec le temps."}"
          </p>
        </Card>
      </section>

      <section className="space-y-4 pb-10">
        <h2 className="text-xl font-headline text-white tracking-wide">MA PROGRESSION</h2>
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-4xl font-headline text-white leading-none">{weeklySessionsDone} / {totalWeeklyGoal}</span>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Séances cette semaine</p>
            </div>
            <span className="text-xl font-headline text-[#E24B4A]">{Math.round(weeklyProgressPercent)}%</span>
          </div>
          <Progress value={weeklyProgressPercent} className="h-3 bg-[#0F0F0F]" />
        </Card>
      </section>
    </div>
  );
}