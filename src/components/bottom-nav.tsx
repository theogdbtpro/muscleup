"use client";

import { cn } from "@/lib/utils";
import { Home, Dumbbell, BarChart2, MessageSquare } from "lucide-react";
import { useState } from "react";

type BottomNavProps = {
  activeTab: "accueil" | "programme" | "progres" | "coach";
  setActiveTab: (tab: string) => void;
};

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const [pressed, setPressed] = useState<string | null>(null);

  const tabs = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "programme", label: "Programme", icon: Dumbbell },
    { id: "progres", label: "Progrès", icon: BarChart2 },
    { id: "coach", label: "Coach", icon: MessageSquare },
  ] as const;

  const handlePress = (id: string) => {
    setPressed(id);
    setActiveTab(id);
    try { navigator.vibrate?.(10); } catch {}
    setTimeout(() => setPressed(null), 150);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-[#1A1A1A]/95 backdrop-blur-md border-t border-[#2A2A2A] px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isPressed = pressed === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handlePress(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200 relative px-3 py-1.5 rounded-2xl",
                isActive ? "text-[#E24B4A]" : "text-zinc-500",
                isPressed ? "scale-90 opacity-70" : "scale-100 opacity-100",
              )}
            >
              {/* Fond actif animé */}
              <div className={cn(
                "absolute inset-0 rounded-2xl transition-all duration-300",
                isActive ? "bg-[#E24B4A]/10" : "bg-transparent"
              )} />

              {/* Icône avec animation */}
              <div className={cn(
                "relative transition-all duration-300",
                isActive ? "scale-110 -translate-y-0.5" : "scale-100"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "stroke-[#E24B4A]" : "stroke-zinc-500"
                )} />
                {/* Point indicateur */}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E24B4A] animate-pulse" />
                )}
              </div>

              <span className={cn(
                "text-[9px] font-bold uppercase tracking-tight transition-all duration-300 relative",
                isActive ? "text-[#E24B4A]" : "text-zinc-600"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}