import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Bell, 
  TrendingUp, 
  Clock
} from 'lucide-react';
import Card from '../UI/Card';
import WeatherCard from '../UI/WeatherCard';
import VoiceButton from '../UI/VoiceButton';
import { useVoice } from '../../hooks/useVoice';
import { useWeather } from '../../hooks/useWeather';

const Home: React.FC = () => {
  const { isListening, startListening, stopListening } = useVoice();
  const { weather, loading, error, refreshWeather } = useWeather();
  
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Good morning, Alex
        </h1>
        <p className="text-white/70">
          {currentDate} • {currentTime}
        </p>
      </motion.div>

      {/* Voice Assistant */}
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <VoiceButton 
          isListening={isListening}
          onToggle={handleVoiceToggle}
        />
      </motion.div>

      {/* Status message */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-white/80 text-lg">
          {isListening ? "I'm listening..." : "Tap to speak with ARIA"}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="text-center">
          <Clock className="text-cyan-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-white/60 text-sm">Tasks Today</p>
        </Card>
        
        <Card className="text-center">
          <Bell className="text-purple-400 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-white">2</p>
          <p className="text-white/60 text-sm">Reminders</p>
        </Card>
      </motion.div>

      {/* Weather Card */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <WeatherCard 
          weather={weather}
          loading={loading}
          error={error}
          onRefresh={refreshWeather}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <Calendar className="text-purple-400 mb-3" size={24} />
            <h4 className="text-white font-semibold mb-1">Schedule</h4>
            <p className="text-white/60 text-sm">View your calendar</p>
          </Card>
          
          <Card>
            <TrendingUp className="text-cyan-400 mb-3" size={24} />
            <h4 className="text-white font-semibold mb-1">Analytics</h4>
            <p className="text-white/60 text-sm">Track productivity</p>
          </Card>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        
        <Card>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Completed "Morning workout"</span>
              <span className="text-white/50 text-xs ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Created task "Review presentations"</span>
              <span className="text-white/50 text-xs ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Set reminder for team meeting</span>
              <span className="text-white/50 text-xs ml-auto">Yesterday</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;