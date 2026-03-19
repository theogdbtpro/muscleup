
"use client";

import { useEffect, useState } from "react";
import Onboarding from "@/components/onboarding";
import Dashboard from "@/components/dashboard";

export type BodyProfile = {
  poids: number;
  taille: number;
  age: number;
  sexe: 'homme' | 'femme';
  objectifPoids: 'perdre' | 'maintenir' | 'prendre';
  activiteQuotidienne: 'sedentaire' | 'leger' | 'modere' | 'actif' | 'tres-actif';
  tourTaille?: number;
  tourHanche?: number;
  tourPoitrine?: number;
  blessures: string[];
};

export type UserProfile = {
  name: string;
  objective: string;
  level: string;
  frequency: string;
  location: 'salle' | 'maison';
  onboarded: boolean;
  bodyProfile?: BodyProfile;
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
    if (newProfile.bodyProfile) {
      localStorage.setItem("muscleup_body_profile", JSON.stringify(newProfile.bodyProfile));
    }
    setProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    localStorage.setItem("muscleup_profile", JSON.stringify(updatedProfile));
    if (updatedProfile.bodyProfile) {
      localStorage.setItem("muscleup_body_profile", JSON.stringify(updatedProfile.bodyProfile));
    }
    setProfile(updatedProfile);
  };

  const handleReset = () => {
    localStorage.removeItem("muscleup_profile");
    localStorage.removeItem("muscleup_body_profile");
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F0F0F]">
        <div className="w-8 h-8 border-4 border-[#E24B4A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Dashboard 
      profile={profile} 
      onUpdateProfile={handleUpdateProfile}
      onReset={handleReset} 
    />
  );
}
