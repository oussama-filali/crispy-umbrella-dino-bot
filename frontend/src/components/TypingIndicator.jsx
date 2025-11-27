import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-bounce-in">
      <div 
        className="bg-card text-card-foreground border-4 border-primary px-6 py-4 rounded-3xl shadow-lg"
        style={{
          boxShadow: '0 4px 16px hsl(142 76% 58% / 0.2), 0 2px 8px hsl(142 76% 58% / 0.1)',
          borderRadius: '1.5rem 1.5rem 1.5rem 0.5rem'
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;