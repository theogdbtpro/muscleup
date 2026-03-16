
"use client";

import { useState, useRef, useEffect } from "react";
import { UserProfile } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { getCoachResponse } from "@/ai/flows/coach-chat";
import { cn } from "@/lib/utils";

type Message = {
  role: 'user' | 'model';
  content: string;
};

type CoachTabProps = {
  profile: UserProfile;
};

const SUGGESTIONS = [
  "Comment progresser plus vite ?",
  "Que manger avant l'entraînement ?",
  "Comment bien récupérer ?",
  "Conseils pour les abdos ?"
];

export default function CoachTab({ profile }: CoachTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Salut ! Je suis ton MuscleUp Coach. Comment puis-je t'aider aujourd'hui à atteindre ton objectif : ${profile.objective} ?` }
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
        profile: {
          objective: profile.objective,
          level: profile.level,
          frequency: profile.frequency
        }
      });
      setMessages(prev => [...prev, { role: 'model', content: response.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Désolé, j'ai eu un petit souci technique. Peux-tu reformuler ?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background fade-in">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-headline text-white leading-none">MuscleUp Coach</h1>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">En ligne</span>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-accent animate-pulse" />
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-accent/20" : "bg-primary/20"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-accent" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' ? "bg-accent text-white rounded-tr-none" : "bg-secondary text-zinc-300 rounded-tl-none border border-zinc-800"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-secondary p-4 rounded-2xl rounded-tl-none border border-zinc-800">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t border-zinc-800">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-secondary border border-zinc-800 text-[10px] font-bold uppercase text-muted-foreground hover:text-white hover:border-zinc-600 transition-colors"
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
            className="bg-secondary border-zinc-800 h-14 pl-4 pr-14 rounded-2xl focus:ring-primary"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
