import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Mic, MessageCircle, CheckSquare } from 'lucide-react';

const Welcome: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      icon: Sparkles,
      title: "Welcome to ARIA",
      subtitle: "Your AI Voice Assistant",
      description: "Experience the future of personal productivity with intelligent voice interactions and seamless task management."
    },
    {
      icon: Mic,
      title: "Voice-First Experience",
      subtitle: "Just Speak Naturally",
      description: "Communicate with ARIA using natural speech. Ask questions, set reminders, or control your smart home devices."
    },
    {
      icon: MessageCircle,
      title: "Smart Conversations",
      subtitle: "Context-Aware Responses",
      description: "ARIA understands context and remembers your preferences to provide personalized assistance every time."
    },
    {
      icon: CheckSquare,
      title: "Effortless Organization",
      subtitle: "Tasks Made Simple",
      description: "Create, organize, and track your tasks with voice commands. Stay productive without lifting a finger."
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/home');
    }
  };

  const skipOnboarding = () => {
    navigate('/home');
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo area */}
        <motion.div
          className="mb-12"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-24 h-24 mx-auto backdrop-blur-xl bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-3xl flex items-center justify-center border border-white/20">
            <CurrentIcon size={48} className="text-white" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {slides[currentSlide].title}
          </h1>
          <h2 className="text-xl text-white/80 mb-6">
            {slides[currentSlide].subtitle}
          </h2>
          <p className="text-white/60 leading-relaxed mb-12">
            {slides[currentSlide].description}
          </p>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/30'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <motion.button
            className="w-full backdrop-blur-xl bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-white/20 rounded-xl py-4 px-6 text-white font-semibold flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextSlide}
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight size={20} />
          </motion.button>

          <button
            className="text-white/60 hover:text-white/80 transition-colors duration-300"
            onClick={skipOnboarding}
          >
            Skip Introduction
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;