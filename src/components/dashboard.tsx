
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import Hub from "./hub";
import ProgramTab from "./program-tab";
import ProgressTab from "./progress-tab";
import NutritionTab from "./nutrition-tab";
import CoachTab from "./coach-tab";

type View = "hub" | "program" | "progress" | "nutrition" | "coach";

type DashboardProps = {
  profile: UserProfile;
  onReset: () => void;
};

export default function Dashboard({ profile, onReset }: DashboardProps) {
  const [view, setView] = useState<View>("hub");

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {view === "hub" && <Hub profile={profile} setView={setView} />}
        {view === "program" && <ProgramTab profile={profile} onBack={() => setView("hub")} />}
        {view === "progress" && <ProgressTab profile={profile} onReset={onReset} onBack={() => setView("hub")} />}
        {view === "nutrition" && <NutritionTab profile={profile} onBack={() => setView("hub")} />}
        {view === "coach" && <CoachTab profile={profile} onBack={() => setView("hub")} />}
      </div>
    </div>
  );
}
