
"use client";

import { useEffect, useState } from "react";
import Onboarding from "@/components/onboarding";
import Dashboard from "@/components/dashboard";

export type UserProfile = {
  objective: string;
  level: string;
  frequency: string;
  onboarded: boolean;
};

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("muscleup_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    localStorage.setItem("muscleup_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard profile={profile} onReset={() => {
    localStorage.removeItem("muscleup_profile");
    setProfile(null);
  }} />;
}
