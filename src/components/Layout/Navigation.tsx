import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  CheckSquare, 
  Settings, 
  FileText,
  Sparkles
} from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/conversation', icon: MessageCircle, label: 'Chat' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/notes', icon: FileText, label: 'Notes' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <motion.div 
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 mx-auto max-w-md"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-around items-center">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-xl"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="text-xs mt-1 relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navigation;