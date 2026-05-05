import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

export const WelcomeScreen = ({ onComplete }) => {
  const [step, setStep] = useState('name'); // 'name' or 'age'
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error('🤔 Ton prénom doit contenir au moins 2 lettres !');
      return;
    }
    setStep('age');
  };

  const handleAgeSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 3 || ageNum > 120) {
      toast.error('🤔 Entre un âge valide (entre 3 et 120 ans) !');
      return;
    }
    onComplete({ name: name.trim(), age: ageNum });
  };

  return (
    <div className="w-full max-w-md bg-background rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      {/* Decorative background */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 p-8 pt-12">
        {/* Dino Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div 
              className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40"
              style={{ transform: 'scale(1.1)' }}
            />
            <Avatar className="h-24 w-24 bg-primary border-4 border-primary relative z-10 shadow-xl">
              <AvatarImage src="/Dino.svg" alt="Dino" className="object-contain" />
              <AvatarFallback className="bg-primary text-6xl">🦖</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Welcome Title */}
        <h1 
          className="text-4xl font-extrabold text-foreground text-center mb-2"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          DINO BOT
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-base">
          Ton assistant de vérification d'infos ! ✨
        </p>

        {/* Name Step */}
        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-lg font-semibold text-foreground mb-3 text-center"
              >
                👋 Quel est ton prénom ?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom..."
                autoFocus
                className="w-full px-6 py-4 rounded-full bg-muted text-foreground text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all text-center"
                style={{
                  boxShadow: 'inset 3px 3px 8px hsl(140 20% 85%), inset -3px -3px 8px hsl(0 0% 100%)'
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full py-6 rounded-full bg-primary hover:bg-primary text-primary-foreground font-bold text-lg shadow-lg transition-all"
              style={{
                boxShadow: '0 4px 16px hsl(142 76% 58% / 0.4), inset 0 -2px 4px hsl(142 76% 45%)'
              }}
            >
              Continuer →
            </Button>
          </form>
        )}

        {/* Age Step */}
        {step === 'age' && (
          <form onSubmit={handleAgeSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="age" 
                className="block text-lg font-semibold text-foreground mb-3 text-center"
              >
                🎂 Salut {name} ! Quel âge as-tu ?
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ton âge..."
                min="3"
                max="120"
                autoFocus
                className="w-full px-6 py-4 rounded-full bg-muted text-foreground text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all text-center"
                style={{
                  boxShadow: 'inset 3px 3px 8px hsl(140 20% 85%), inset -3px -3px 8px hsl(0 0% 100%)'
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  setStep('name');
                  setAge('');
                }}
                variant="outline"
                className="flex-1 py-6 rounded-full font-bold text-base"
              >
                ← Retour
              </Button>
              <Button
                type="submit"
                className="flex-1 py-6 rounded-full bg-primary hover:bg-primary text-primary-foreground font-bold text-base shadow-lg transition-all"
                style={{
                  boxShadow: '0 4px 16px hsl(142 76% 58% / 0.4), inset 0 -2px 4px hsl(142 76% 45%)'
                }}
              >
                C'est parti ! 🚀
              </Button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          🔒 Tes données restent privées et sécurisées
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;