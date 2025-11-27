import React from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export const ChatMessages = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-scroll">
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id} 
          message={message}
          isLatest={index === messages.length - 1}
        />
      ))}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;