
"use client";

import { cn } from "@/lib/utils";
import { Dumbbell, Activity, Utensils } from "lucide-react";

type BottomNavProps = {
  activeTab: "program" | "progress" | "nutrition";
  setActiveTab: (tab: "program" | "progress" | "nutrition") => void;
};

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "program", label: "Programme", icon: Dumbbell },
    { id: "progress", label: "Progrès", icon: Activity },
    { id: "nutrition", label: "Nutrition", icon: Utensils },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-black/90 backdrop-blur-md border-t border-zinc-800 px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
