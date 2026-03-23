
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

  useEffect(() => {
    // Écouter l'état de l'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Si l'utilisateur est connecté, on charge son profil local
        // (À terme, on chargera depuis Firestore)
        const stored = localStorage.getItem(`muscleup_profile_${firebaseUser.uid}`);
        if (stored) {
          setProfile(JSON.parse(stored));
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    if (!user) return;
    localStorage.setItem(`muscleup_profile_${user.uid}`, JSON.stringify(newProfile));
    if (newProfile.bodyProfile) {
      localStorage.setItem(`muscleup_body_profile_${user.uid}`, JSON.stringify(newProfile.bodyProfile));
    }
    setProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    if (!user) return;
    localStorage.setItem(`muscleup_profile_${user.uid}`, JSON.stringify(updatedProfile));
    if (updatedProfile.bodyProfile) {
      localStorage.setItem(`muscleup_body_profile_${user.uid}`, JSON.stringify(updatedProfile.bodyProfile));
    }
    setProfile(updatedProfile);
  };

  const handleReset = () => {
    auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0F0F0F]">
        <div className="w-8 h-8 border-4 border-[#E24B4A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Étape 1 : Si pas d'utilisateur, écran Auth
  if (!user) {
    return <AuthScreen />;
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
