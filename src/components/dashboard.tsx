
"use client";

import { useState } from "react";
import { UserProfile } from "@/app/page";
import BottomNav from "./bottom-nav";
import ProgramTab from "./program-tab";
import ProgressTab from "./progress-tab";
import NutritionTab from "./nutrition-tab";
import CoachTab from "./coach-tab";

type DashboardProps = {
  profile: UserProfile;
  onReset: () => void;
};

export default function Dashboard({ profile, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"program" | "progress" | "nutrition" | "coach">("program");

  return (
    <div className="flex-1 flex flex-col bg-background relative pb-20 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {activeTab === "program" && <ProgramTab profile={profile} />}
        {activeTab === "progress" && <ProgressTab profile={profile} onReset={onReset} />}
        {activeTab === "nutrition" && <NutritionTab profile={profile} />}
        {activeTab === "coach" && <CoachTab profile={profile} />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
