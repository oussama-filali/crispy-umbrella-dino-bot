import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export const ChatHeader = ({ userName }) => {
  return (
    <div className="relative">
      {/* Curved Green Header with Neumorphic Effect */}
      <div 
        className="bg-primary px-6 py-6 pb-10 rounded-b-[3rem] relative z-10"
        style={{
          boxShadow: '0 8px 24px hsl(142 76% 58% / 0.3), inset 0 -2px 8px hsl(142 76% 45%)'
        }}
      >
        <div className="flex items-center gap-4">
          {/* Dino Avatar with 3D effect */}
          <div className="relative">
            <div 
              className="absolute inset-0 bg-primary-foreground rounded-full blur-md opacity-50"
              style={{ transform: 'scale(0.95)' }}
            />
            <Avatar className="h-16 w-16 bg-primary-foreground border-4 border-primary-foreground relative z-10 shadow-lg">
              <AvatarImage src="/Dino.svg" alt="Dino" className="object-contain" />
              <AvatarFallback className="bg-primary-foreground text-5xl">🦖</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Title with 3D Text Effect */}
          <div className="flex-1">
            <h1 
              className="text-3xl font-extrabold text-primary-foreground tracking-wide"
              style={{
                fontFamily: 'Fredoka, sans-serif',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              DINO BOT
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
              <span className="text-sm text-primary-foreground/90 font-medium">En ligne</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative wave overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-6 bg-background"
        style={{
          clipPath: 'ellipse(60% 100% at 50% 100%)'
        }}
      />
    </div>
  );
};

export default ChatHeader;