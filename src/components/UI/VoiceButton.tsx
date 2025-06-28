import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  isListening, 
  onToggle, 
  size = 'lg' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple effects */}
      {isListening && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${sizeClasses[size]} border-2 border-white/30 rounded-full`}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ 
                scale: [1, 2, 3],
                opacity: [0.8, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Main button */}
      <motion.button
        className={`${sizeClasses[size]} backdrop-blur-xl bg-white/20 border border-white/30 rounded-full flex items-center justify-center relative overflow-hidden group`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        animate={isListening ? {
          boxShadow: [
            "0 0 0 0 rgba(255, 255, 255, 0.4)",
            "0 0 0 10px rgba(255, 255, 255, 0.1)",
            "0 0 0 20px rgba(255, 255, 255, 0)"
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <motion.div
          animate={isListening ? { rotate: [0, 5, -5, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
        >
          {isListening ? (
            <MicOff size={iconSizes[size]} className="text-white relative z-10" />
          ) : (
            <Mic size={iconSizes[size]} className="text-white relative z-10" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default VoiceButton;