
"use client";

import { useEffect, useState } from "react";
import Onboarding from "@/components/onboarding";
import Dashboard from "@/components/dashboard";
import AuthScreen from "@/components/auth-screen";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Si auth n'a pas de méthode onAuthStateChanged (mode mock)
    if (!auth || !auth.onAuthStateChanged) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      setUser(firebaseUser);
      
      const uid = firebaseUser ? firebaseUser.uid : "guest";
      const stored = localStorage.getItem(`muscleup_profile_${uid}`);
      
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const uid = user ? user.uid : "guest";
    localStorage.setItem(`muscleup_profile_${uid}`, JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const uid = user ? user.uid : "guest";
    localStorage.setItem(`muscleup_profile_${uid}`, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  const handleReset = () => {
    if (user) {
      auth.signOut();
    } else {
      setIsGuest(false);
      setProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F0F0F]">
        <div className="w-8 h-8 border-4 border-[#E24B4A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Étape 1 : Si pas d'utilisateur et pas en mode invité, écran Auth
  if (!user && !isGuest) {
    return (
      <div className="flex-1 flex flex-col">
        <AuthScreen />
        <button 
          onClick={() => setIsGuest(true)}
          className="bg-transparent text-zinc-600 text-[10px] font-bold uppercase tracking-widest pb-10 hover:text-white transition-colors"
        >
          Continuer sans compte (mode démo)
        </button>
      </div>
    );
  }

  // Étape 2 : Si utilisateur mais pas de profil, Onboarding
  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Étape 3 : Dashboard
  return (
    <Dashboard 
      profile={profile} 
      onUpdateProfile={handleUpdateProfile}
      onReset={handleReset} 
    />
  );
}
