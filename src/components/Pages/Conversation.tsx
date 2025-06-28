import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Type, Sparkles } from 'lucide-react';
import Card from '../UI/Card';
import VoiceButton from '../UI/VoiceButton';
import { useVoice } from '../../hooks/useVoice';
import { Message } from '../../types';

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm ARIA, your AI voice assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const { isListening, startListening, stopListening } = useVoice();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isUser: true,
      timestamp: new Date(),
      type: inputMode
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (input: string): string => {
    const responses = [
      "I understand. Let me help you with that right away.",
      "That's a great question! Here's what I think...",
      "I've processed your request. Here are some suggestions:",
      "Based on what you've told me, I recommend...",
      "I can definitely help you with that. Let me walk you through it."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const suggestedActions = [
    "What's on my calendar today?",
    "Set a reminder for 3 PM",
    "Create a new task",
    "What's the weather like?"
  ];

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-6 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="text-purple-400" size={24} />
          <h1 className="text-2xl font-bold text-white">ARIA Chat</h1>
        </div>
        <p className="text-white/60">Your intelligent voice assistant</p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.isUser
                  ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-white border border-white/20'
                  : 'backdrop-blur-xl bg-white/10 text-white border border-white/20'
              }`}
            >
              <p>{message.content}</p>
              <div className="flex items-center space-x-2 mt-2">
                {message.type === 'voice' && (
                  <Mic size={12} className="text-white/60" />
                )}
                <span className="text-xs text-white/60">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggested Actions */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-wrap gap-2">
          {suggestedActions.map((action, index) => (
            <motion.button
              key={index}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInputText(action)}
            >
              {action}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            {/* Mode Toggle */}
            <button
              className={`p-2 rounded-lg transition-all duration-300 ${
                inputMode === 'voice' 
                  ? 'bg-purple-500/30 text-white' 
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
              onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
            >
              {inputMode === 'voice' ? <Mic size={20} /> : <Type size={20} />}
            </button>

            {/* Input Field */}
            {inputMode === 'text' ? (
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  disabled={!inputText.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <VoiceButton
                  isListening={isListening}
                  onToggle={handleVoiceToggle}
                  size="sm"
                />
                <span className="ml-3 text-white/80">
                  {isListening ? "Listening..." : "Tap to speak"}
                </span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Conversation;