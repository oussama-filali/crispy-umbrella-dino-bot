import React from 'react';

export const MessageBubble = ({ message, isLatest }) => {
  const isBot = message.type === 'bot';
  
  return (
    <div 
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-bounce-in`}
    >
      <div 
        className={`
          max-w-[80%] px-5 py-4 rounded-3xl font-medium text-base
          ${isBot 
            ? 'bg-card text-card-foreground border-4 border-primary shadow-lg' 
            : 'bg-accent text-accent-foreground shadow-lg'
          }
        `}
        style={{
          boxShadow: isBot 
            ? '0 4px 16px hsl(142 76% 58% / 0.2), 0 2px 8px hsl(142 76% 58% / 0.1)'
            : '0 4px 16px hsl(271 81% 66% / 0.3), 0 2px 8px hsl(271 81% 66% / 0.15)',
          borderRadius: isBot 
            ? '1.5rem 1.5rem 1.5rem 0.5rem'
            : '1.5rem 1.5rem 0.5rem 1.5rem'
        }}
      >
        <p className="leading-relaxed">{message.text}</p>
        
        {/* Timestamp */}
        <div className={`text-xs mt-2 ${isBot ? 'text-muted-foreground' : 'text-accent-foreground/70'}`}>
          {message.timestamp.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;