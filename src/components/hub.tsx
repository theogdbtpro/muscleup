
"use client";

import { UserProfile } from "@/app/page";
import { PROGRAMS, Session, Program } from "@/data/programs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Utensils, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Dumbbell, 
  Home as HomeIcon, 
  BarChart, 
  LogOut, 
  User as UserIcon,
  Lightbulb,
  Activity,
  Calendar,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { getExerciseAdvice } from "@/ai/flows/exercise-advice";

const getLocalDateStr = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
};

type HubProps = {
  profile: UserProfile;
  setView: (view: any) => void;
  onStartSession: (sessionId?: string) => void;
  onReset: () => void;
};

const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function generateBaseSchedule(frequency: string, program: Program): Record<string, string | null> {
  const nbSessions = frequency === "2j" ? 2 : frequency === "3j" ? 3 : frequency === "4j" ? 4 : 5;
  const sessionIds = program.sessions.filter(s => !s.isRestDay).map(s => s.id);
  const result: Record<string, string | null> = {};
  DAY_NAMES.forEach(d => { result[d] = null; });
  const step = DAY_NAMES.length / nbSessions;
  for (let i = 0; i < nbSessions; i++) {
    const dayIdx = Math.min(Math.floor(i * step), DAY_NAMES.length - 1);
    result[DAY_NAMES[dayIdx]] = sessionIds[i % sessionIds.length];
  }
  return result;
}

export default function Hub({ profile, setView, onStartSession, onReset }: HubProps) {
  const { toast } = useToast();
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [currentWeekSchedule, setCurrentWeekSchedule] = useState<Record<string, string | null>>({});
  const [dailyAdvice, setDailyAdvice] = useState<string>("Charge tes batteries pour ta prochaine séance !");
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  const program = useMemo(() => PROGRAMS.find((p) => p.id === profile.objective) || PROGRAMS[0], [profile.objective]);
  const user = auth.currentUser;
  const uidPrefix = user ? `_${user.uid}` : "_guest";

  useEffect(() => {
    const loadData = () => {
      const keys = [
        { key: "completedDates", setter: setCompletedDates },
        { key: "muscleup_session_names", setter: setCustomNames },
        { key: "muscleup_schedule", setter: setCurrentWeekSchedule }
      ];

      keys.forEach(({ key, setter }) => {
        const newKey = key + uidPrefix;
        const stored = localStorage.getItem(newKey) || localStorage.getItem(key);
        if (stored) {
          setter(JSON.parse(stored));
        } else if (key === "muscleup_schedule") {
          const generated = generateBaseSchedule(profile.frequency, program);
          setCurrentWeekSchedule(generated);
        }
      });
    };
    loadData();
  }, [profile.frequency, program, uidPrefix]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      try {
        const res = await getExerciseAdvice({
          exerciseName: "Musculation générale",
          level: profile.level,
          objective: profile.objective
        });
        setDailyAdvice(res.advice);
      } catch (e) {
        setDailyAdvice("Garde les omoplates serrées sur le banc pour protéger tes épaules.");
      } finally {
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [profile.level, profile.objective]);

  const getSessionName = (session: Session) => customNames[session.id] || session.name;

  const finishedToday = useMemo(() => completedDates.includes(getLocalDateStr()), [completedDates]);

  // Calcul progression
  const weeklyStats = useMemo(() => {
    const totalPlanned = Object.values(currentWeekSchedule).filter(id => id !== null).length;
    const doneThisWeek = DAY_NAMES.filter(day => {
      const date = new Date();
      const currentDayIdx = (date.getDay() + 6) % 7;
      const dayIdx = DAY_NAMES.indexOf(day);
      const diff = dayIdx - currentDayIdx;
      const targetDate = new Date();
      targetDate.setDate(date.getDate() + diff);
      const dateStr = targetDate.toISOString().split('T')[0];
      return completedDates.includes(dateStr) && currentWeekSchedule[day] !== null;
    }).length;
    
    return {
      total: totalPlanned,
      done: doneThisWeek,
      percent: totalPlanned > 0 ? Math.round((doneThisWeek / totalPlanned) * 100) : 0
    };
  }, [currentWeekSchedule, completedDates]);

  const moveSession = (day: string, direction: 'up' | 'down') => {
    const index = DAY_NAMES.indexOf(day);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= DAY_NAMES.length) return;

    const targetDay = DAY_NAMES[targetIdx];
    const newSchedule = { ...currentWeekSchedule };
    const tmp = newSchedule[day];
    newSchedule[day] = newSchedule[targetDay];
    newSchedule[targetDay] = tmp;

    setCurrentWeekSchedule(newSchedule);
    localStorage.setItem(`muscleup_schedule${uidPrefix}`, JSON.stringify(newSchedule));
    localStorage.setItem(`muscleup_base_schedule${uidPrefix}`, JSON.stringify(newSchedule));
    try { navigator.vibrate?.(10); } catch {}
  };

  const bodyProfileStats = useMemo(() => {
    if (!profile.bodyProfile) return null;
    const { poids, taille } = profile.bodyProfile;
    const imc = poids / ((taille / 100) ** 2);
    let color = "text-green-500";
    if (imc < 18.5 || imc >= 25) color = "text-yellow-500";
    if (imc >= 30) color = "text-red-500";
    return { summary: `${poids}KG · ${taille}CM · IMC ${imc.toFixed(1)}`, color };
  }, [profile.bodyProfile]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-headline text-white leading-none">
              {profile.name ? `Bonjour ${profile.name} !` : "Bonjour !"}
            </h1>
            <div className="flex items-center gap-1">
              {!user ? (
                <button onClick={() => window.location.reload()} className="p-1.5 bg-zinc-800/50 rounded-lg text-zinc-400"><UserIcon className="w-3.5 h-3.5" /></button>
              ) : (
                <button onClick={() => auth.signOut()} className="p-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-primary"><LogOut className="w-3.5 h-3.5" /></button>
              )}
            </div>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            {profile.location === 'maison' ? "🏠 Mode Maison" : "🏋️ Mode Salle"}
          </p>
        </div>
        <div className="bg-[#E24B4A]/10 px-4 py-2 rounded-full flex items-center gap-2 border border-[#E24B4A]/20">
          <Flame className="w-4 h-4 text-[#E24B4A] fill-[#E24B4A]" />
          <span className="text-sm font-bold text-white tracking-tighter">{completedDates.length} SÉANCES</span>
        </div>
      </header>

      {/* Grille de navigation (PROGRÈS, NUTRITION, PLANNING) */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setView("progres")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all">
          <Activity className="w-6 h-6 text-[#EE3BAA]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Progrès</span>
        </button>
        <button onClick={() => setView("nutrition")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all">
          <Utensils className="w-6 h-6 text-[#E24B4A]" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Nutrition</span>
        </button>
        <button onClick={() => setView("planning-mensuel")} className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all">
          <Calendar className="w-6 h-6 text-purple-400" />
          <span className="text-[10px] font-bold uppercase text-zinc-400">Planning</span>
        </button>
      </div>

      {/* Profil Corporel Card */}
      <button onClick={() => setView("body-profile")} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BarChart className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <span className="text-[12px] font-bold text-white uppercase block leading-tight">Mon profil corporel 📊</span>
            <span className={cn("text-[10px] font-bold uppercase tracking-tight", bodyProfileStats?.color || "text-zinc-500")}>
              {bodyProfileStats?.summary || "Complète tes mesures"}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
      </button>

      {/* Conseil du Jour */}
      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide uppercase">Conseil du jour</h2>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-3xl flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-amber-500" />
          </div>
          <p className={cn("text-sm text-zinc-300 italic leading-relaxed", loadingAdvice && "animate-pulse")}>
            "{dailyAdvice}"
          </p>
        </Card>
      </section>

      {/* Ma Progression */}
      <section className="space-y-4">
        <h2 className="text-xl font-headline text-white tracking-wide uppercase">Ma progression</h2>
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-4xl font-headline text-white">{weeklyStats.done} / {weeklyStats.total}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Séances cette semaine</div>
            </div>
            <div className="text-2xl font-headline text-primary">{weeklyStats.percent}%</div>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${weeklyStats.percent}%` }}
            />
          </div>
        </Card>
      </section>

      {/* Planning avec flèches de déplacement */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline text-white tracking-wide uppercase">Planning</h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ma semaine</span>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl overflow-hidden">
          {DAY_NAMES.map((day, idx) => {
            const sessionId = currentWeekSchedule[day];
            const session = program.sessions.find(s => s.id === sessionId);
            const isToday = (new Date().getDay() + 6) % 7 === idx;
            
            return (
              <div key={day} className={cn("p-4 flex items-center justify-between border-b border-[#2A2A2A] last:border-0", isToday ? "bg-primary/5" : "")}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12">
                    <span className={cn("text-[10px] font-bold uppercase", isToday ? "text-primary" : "text-zinc-600")}>{day.slice(0, 3)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-bold uppercase truncate max-w-[150px]", session ? "text-white" : "text-zinc-800")}>
                      {session ? getSessionName(session) : "Repos 💤"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session && (
                    <div className="flex flex-col gap-1 mr-2">
                      <button disabled={idx === 0} onClick={() => moveSession(day, 'up')} className="p-1.5 bg-zinc-800 rounded-md text-zinc-500 disabled:opacity-10 hover:text-white"><ChevronUp className="w-3 h-3" /></button>
                      <button disabled={idx === 6} onClick={() => moveSession(day, 'down')} className="p-1.5 bg-zinc-800 rounded-md text-zinc-500 disabled:opacity-10 hover:text-white"><ChevronDown className="w-3 h-3" /></button>
                    </div>
                  )}
                  {session && isToday && !finishedToday && (
                    <button onClick={() => onStartSession(session.id)} className="bg-primary text-white text-[9px] font-black px-3 py-2 rounded-xl uppercase tracking-tighter active:scale-95 transition-all">GO !</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
