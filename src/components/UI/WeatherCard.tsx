import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  RefreshCw, 
  Droplets, 
  Wind, 
  Thermometer,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap
} from 'lucide-react';
import Card from './Card';
import { WeatherData } from '../../types';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weather, 
  loading, 
  error, 
  onRefresh 
}) => {
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      '01d': Sun, '01n': Sun,
      '02d': Cloud, '02n': Cloud,
      '03d': Cloud, '03n': Cloud,
      '04d': Cloud, '04n': Cloud,
      '09d': CloudRain, '09n': CloudRain,
      '10d': CloudRain, '10n': CloudRain,
      '11d': Zap, '11n': Zap,
      '13d': CloudSnow, '13n': CloudSnow,
      '50d': Cloud, '50n': Cloud,
    };
    
    return iconMap[iconCode] || Cloud;
  };

  if (loading) {
    return (
      <Card gradient>
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={24} className="text-white/60" />
          </motion.div>
          <span className="ml-3 text-white/80">Getting your location...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card gradient>
        <div className="text-center py-4">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button
            onClick={onRefresh}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card gradient>
        <div className="text-center py-8">
          <Cloud size={48} className="text-white/30 mx-auto mb-4" />
          <p className="text-white/60">Weather data unavailable</p>
          <button
            onClick={onRefresh}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm mt-2"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.icon);

  return (
    <Card gradient>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-white/60" />
          <span className="text-white/80 text-sm">{weather.location}</span>
        </div>
        <button
          onClick={onRefresh}
          className="text-white/60 hover:text-white/80 transition-colors duration-300"
          disabled={loading}
        >
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw size={16} />
          </motion.div>
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-4xl font-bold text-white">{weather.temperature}°F</p>
          <p className="text-white/60">{weather.condition}</p>
          {weather.feelsLike && (
            <p className="text-white/50 text-sm">Feels like {weather.feelsLike}°F</p>
          )}
        </div>
        <div className="text-right">
          <WeatherIcon size={48} className="text-white/80 mb-2" />
          {weather.high && weather.low && (
            <p className="text-white/60 text-sm">H: {weather.high}° L: {weather.low}°</p>
          )}
        </div>
      </div>

      {/* Additional weather details */}
      {(weather.humidity || weather.windSpeed) && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {weather.humidity && (
            <div className="flex items-center space-x-2">
              <Droplets size={16} className="text-cyan-400" />
              <div>
                <p className="text-white/80 text-sm">{weather.humidity}%</p>
                <p className="text-white/50 text-xs">Humidity</p>
              </div>
            </div>
          )}
          {weather.windSpeed && (
            <div className="flex items-center space-x-2">
              <Wind size={16} className="text-purple-400" />
              <div>
                <p className="text-white/80 text-sm">{weather.windSpeed} mph</p>
                <p className="text-white/50 text-xs">Wind</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default WeatherCard;