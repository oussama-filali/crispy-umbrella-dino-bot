import React, { useState, useRef, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import { Toaster } from './components/ui/sonner';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function App() {
  const [user, setUser] = useState(null); // { name: string, age: number }
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialiser le chat après l'accueil
  useEffect(() => {
    if (user && messages.length === 0) {
      // Message d'accueil de Dino
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        text: `Coucou ${user.name} ! 👋 Je suis Dino. Demande-moi si c'est VRAI ou FAUX ! 🦕`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  const handleUserComplete = (userData) => {
    setUser(userData);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !user) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Afficher l'indicateur de saisie
    setIsTyping(true);

    try {
      // Appel à l'API backend
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          name: user.name,
          age: user.age,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de connexion avec le serveur');
      }

      const data = await response.json();

      // Ajouter la réponse du bot
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      
      // Message d'erreur pour l'utilisateur
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: '😅 Oups ! J’ai un petit problème technique. Peux-tu réessayer ?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Afficher l'écran d'accueil si l'utilisateur n'est pas encore défini
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <WelcomeScreen onComplete={handleUserComplete} />
        <Toaster />
      </div>
    );
  }

  // Afficher le chat normal
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Mobile Chat Container */}
      <div className="w-full max-w-md h-[100vh] sm:h-[600px] bg-background rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Chat Header */}
        <ChatHeader userName={user.name} />
        
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