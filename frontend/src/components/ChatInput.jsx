import React, { useState } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

export const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-card px-4 py-5 border-t-4 border-primary/20">
      <form onSubmit={handleSubmit} className="relative">
        {/* Input Field with Neumorphic Style */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écris ta question..."
            className="w-full px-6 py-4 pr-16 rounded-full bg-muted text-foreground text-base font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all"
            style={{
              boxShadow: 'inset 3px 3px 8px hsl(140 20% 85%), inset -3px -3px 8px hsl(0 0% 100%)'
            }}
          />
          
          {/* 3D Candy Send Button */}
          <Button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary hover:bg-primary text-primary-foreground p-0 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all animate-pulse-green"
            style={{
              boxShadow: '0 4px 12px hsl(142 76% 58% / 0.4), inset 0 -2px 4px hsl(142 76% 45%), inset 0 2px 4px hsl(142 76% 70%)'
            }}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
      
      {/* Hint Text */}
      <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
        💬 Pose une question à Dino !
      </p>
    </div>
  );
};

export default ChatInput;