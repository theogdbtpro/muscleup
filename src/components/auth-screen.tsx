
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#0F0F0F] justify-center items-center">
      <div className="w-full max-w-sm space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-headline text-[#E24B4A] tracking-tighter">MUSCLEUP</h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
            {isLogin ? "Ravi de te revoir, Athlète" : "Rejoins la légion MuscleUp"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Ton prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1A1A1A] border-zinc-800 h-14 pl-12 rounded-xl text-white placeholder:text-zinc-600 focus:ring-[#E24B4A]"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1A1A1A] border-zinc-800 h-14 pl-12 rounded-xl text-white placeholder:text-zinc-600 focus:ring-[#E24B4A]"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1A1A1A] border-zinc-800 h-14 pl-12 rounded-xl text-white placeholder:text-zinc-600 focus:ring-[#E24B4A]"
              required
            />
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 bg-[#E24B4A] hover:bg-[#E24B4A]/90 text-white font-headline text-xl rounded-xl shadow-xl shadow-[#E24B4A]/10"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="flex items-center gap-2">
                {isLogin ? "SE CONNECTER" : "CRÉER MON COMPTE"}
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-[#E24B4A] transition-colors"
          >
            {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
