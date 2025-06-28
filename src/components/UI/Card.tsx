import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false 
}) => {
  return (
    <motion.div
      className={`
        backdrop-blur-xl border border-white/20 rounded-2xl p-6 
        ${gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/10'}
        ${hover ? 'hover:bg-white/15 transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;