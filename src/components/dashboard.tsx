
"use client";

import { useState } from "react";
import { UserProfile, BodyProfile } from "@/app/page";
import Hub from "./hub";
import ProgramTab from "./program-tab";
import ProgressTab from "./progress-tab";
import NutritionTab from "./nutrition-tab";
import CoachTab from "./coach-tab";
import SettingsTab from "./settings-tab";
import BottomNav from "./bottom-nav";
import BodyProfileView from "./body-profile";

type View = "accueil" | "programme" | "progres" | "coach" | "nutrition" | "settings" | "body-profile";

type DashboardProps = {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onReset: () => void;
};

export default function Dashboard({ profile, onUpdateProfile, onReset }: DashboardProps) {
  const [view, setView] = useState<View>("accueil");
  const [refreshKey, setRefreshKey] = useState(0);
  const [manualSessionId, setManualSessionId] = useState<string | null>(null);

  const handleSetView = (newView: View) => {
    setView(newView);
    if (newView === "accueil") {
      setRefreshKey(k => k + 1);
    }
  };

  const handleStartSession = (sessionId?: string) => {
    if (sessionId) setManualSessionId(sessionId);
    else setManualSessionId(null);
    setView("programme");
  };

  const handleSaveBodyProfile = (data: BodyProfile) => {
    onUpdateProfile({ ...profile, bodyProfile: data });
    setView("accueil");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F0F] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {view === "accueil" && (
          <Hub 
            key={refreshKey} 
            profile={profile} 
            setView={handleSetView} 
            onStartSession={handleStartSession}
          />
        )}
        {view === "programme" && (
          <ProgramTab 
            profile={profile} 
            onBack={() => handleSetView("accueil")} 
            onUpdateProfile={onUpdateProfile}
            manualSessionId={manualSessionId}
          />
        )}
        {view === "progres" && (
          <ProgressTab 
            profile={profile} 
            onReset={onReset} 
            onBack={() => handleSetView("accueil")} 
          />
        )}
        {view === "coach" && (
          <CoachTab 
            profile={profile} 
            onBack={() => handleSetView("accueil")} 
          />
        )}
        {view === "nutrition" && (
          <NutritionTab 
            profile={profile} 
            onBack={() => handleSetView("accueil")} 
          />
        )}
        {view === "settings" && (
          <SettingsTab 
            profile={profile} 
            onUpdateProfile={onUpdateProfile} 
            onBack={() => handleSetView("accueil")} 
          />
        )}
        {view === "body-profile" && (
          <BodyProfileView 
            initialData={profile.bodyProfile}
            onSave={handleSaveBodyProfile}
            onBack={() => handleSetView("accueil")}
          />
        )}
      </div>
      {view !== "body-profile" && (
        <BottomNav
          activeTab={view === "accueil" ? "accueil" : view as any}
          setActiveTab={(tab) => handleSetView(tab as any)}
        />
      )}
    </div>
  );
}
