"use client";

import { useState, useRef, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Send, Bot, Loader2, Sparkles } from "lucide-react";
import { getCoachResponse } from "@/ai/flows/coach-chat";
import { cn } from "@/lib/utils";

type Message = {
  role: 'user' | 'model';
  content: string;
};

type CoachTabProps = {
  profile: UserProfile;
  onBack: () => void;
};

const SUGGESTIONS = [
  "Comment progresser plus vite ?",
  "Que manger avant l'entraînement ?",
  "Conseils récupération"
];

export default function CoachTab({ profile, onBack }: CoachTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Salut Athlète ! Je suis ton MuscleUp Coach. Comment puis-je t'aider à atteindre ton objectif : ${profile.objective} ?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await getCoachResponse({
        message: text,
        history: messages,
        profile: { objective: profile.objective, level: profile.level, frequency: profile.frequency }
      });
      setMessages(prev => [...prev, { role: 'model', content: response.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Désolé, j'ai rencontré une erreur technique. Réessaie." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col animate-in slide-in-from-right duration-300">
      <header className="p-6 flex items-center justify-between bg-[#0F0F0F] z-10 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-zinc-500">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E24B4A]/10 flex items-center justify-center relative">
              <Bot className="w-6 h-6 text-[#E24B4A]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F0F0F]" />
            </div>
            <div>
              <h1 className="text-xl font-headline text-white leading-none">MUSCLEUP COACH</h1>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En ligne</span>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-[#E24B4A]" />
      </header>

      <ScrollArea className="flex-1 px-6 pt-6 pb-24">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex max-w-[85%] animate-in fade-in slide-in-from-bottom-2", msg.role === 'user' ? "ml-auto" : "")}>
              <div className={cn(
                "p-5 rounded-2xl text-sm leading-relaxed font-medium shadow-sm",
                msg.role === 'user' 
                  ? "bg-[#E24B4A] text-white rounded-br-none" 
                  : "bg-[#1A1A1A] text-zinc-300 border border-[#2A2A2A] rounded-bl-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-[#E24B4A] animate-pulse ml-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Le coach réfléchit...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-6 bg-[#0F0F0F] border-t border-[#2A2A2A] space-y-6 sticky bottom-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap px-4 py-2.5 rounded-full bg-[#1A1A1A] text-[10px] font-bold uppercase text-zinc-400 border border-[#2A2A2A] hover:bg-[#2A2A2A] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Pose ta question..."
            className="bg-[#1A1A1A] border-[#2A2A2A] h-16 pl-6 pr-16 rounded-xl focus:ring-[#E24B4A] text-base"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-12 h-12 rounded-lg bg-[#E24B4A] hover:bg-[#E24B4A]/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}