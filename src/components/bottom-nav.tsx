"use client";

import { cn } from "@/lib/utils";
import { Home, Dumbbell, BarChart2, MessageSquare } from "lucide-react";

type BottomNavProps = {
  activeTab: "accueil" | "programme" | "progres" | "coach";
  setActiveTab: (tab: string) => void;
};

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "programme", label: "Programme", icon: Dumbbell },
    { id: "progres", label: "Progrès", icon: BarChart2 },
    { id: "coach", label: "Coach", icon: MessageSquare },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-[#1A1A1A]/95 backdrop-blur-md border-t border-[#2A2A2A] px-6 py-4 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "text-[#E24B4A]" : "text-zinc-500"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-[#E24B4A]/10")} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}