
"use client";

import { useState, useRef, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Send, Bot, Loader2 } from "lucide-react";
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
  "Conseil récupération"
];

export default function CoachTab({ profile, onBack }: CoachTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Salut ! Prêt à atteindre ton objectif : ${profile.objective} ? Pose-moi tes questions.` }
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
      setMessages(prev => [...prev, { role: 'model', content: "Désolé, réessaie plus tard." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-background flex flex-col animate-in slide-in-from-right duration-300">
      <header className="p-6 flex items-center gap-4 bg-background z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-headline text-white leading-none">MuscleUp Coach</h1>
        </div>
      </header>

      <ScrollArea className="flex-1 px-6 pb-10">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex max-w-[85%]", msg.role === 'user' ? "ml-auto" : "")}>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-primary text-white" : "bg-secondary text-zinc-300 border border-zinc-800"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto mt-4" />}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t border-zinc-800 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-secondary text-[10px] font-bold uppercase text-zinc-400 border border-zinc-800"
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
            className="bg-secondary border-none h-16 pl-4 pr-16 rounded-2xl focus:ring-primary text-lg"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 w-12 h-12 rounded-xl bg-primary"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
