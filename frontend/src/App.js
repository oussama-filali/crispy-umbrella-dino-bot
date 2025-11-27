import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Coucou ! 👋 Je suis Dino. Demande-moi si c\'est VRAI ou FAUX ! 🦕',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot typing
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const responses = [
        'C\'est VRAI ! 🦖 Bien joué !',
        'Hmm, c\'est FAUX ! 🤔 Essaie encore !',
        'Excellente question ! 🌟 La réponse est VRAI !',
        'Oh non, c\'est FAUX ! 🦕 Continue d\'essayer !',
        'Bravo ! 🎉 C\'est absolument VRAI !',
        'Intéressant ! 🤓 Mais c\'est FAUX !',
        'Super ! 🌈 Tu as raison, c\'est VRAI !',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Mobile Chat Container */}
      <div className="w-full max-w-md h-[100vh] sm:h-[600px] bg-background rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Chat Header */}
        <ChatHeader />
        
        {/* Chat Messages Area */}
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
        
        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;