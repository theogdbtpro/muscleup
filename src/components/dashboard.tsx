"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import Hub from "./hub";
import ProgramTab from "./program-tab";
import ProgressTab from "./progress-tab";
import NutritionTab from "./nutrition-tab";
import CoachTab from "./coach-tab";
import BottomNav from "./bottom-nav";

type View = "accueil" | "programme" | "progres" | "coach";

type DashboardProps = {
  profile: UserProfile;
  onReset: () => void;
};

export default function Dashboard({ profile, onReset }: DashboardProps) {
  const [view, setView] = useState<View>("accueil");

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F0F] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {view === "accueil" && <Hub profile={profile} setView={setView} />}
        {view === "programme" && <ProgramTab profile={profile} onBack={() => setView("accueil")} />}
        {view === "progres" && <ProgressTab profile={profile} onReset={onReset} onBack={() => setView("accueil")} />}
        {view === "coach" && <CoachTab profile={profile} onBack={() => setView("accueil")} />}
        {/* Nutrition est accessible via le Hub dans cette refonte */}
        {/* @ts-ignore */}
        {view === "nutrition" && <NutritionTab profile={profile} onBack={() => setView("accueil")} />}
      </div>

      <BottomNav 
        activeTab={view === "accueil" ? "accueil" : view as any} 
        setActiveTab={(tab) => setView(tab as any)} 
      />
    </div>
  );
}