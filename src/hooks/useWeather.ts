import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';

interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  loadWeather: () => Promise<void>;
  refreshWeather: () => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationCoords | null>(null);

  const API_KEY = '0a29ca5c1fd8703e7253eff202b7358f'; // Replace with your actual key

  // Get user's current geolocation
  const getCurrentLocation = useCallback((): Promise<GeolocationCoords> => {
    if (!navigator.geolocation) {
      return Promise.reject(new Error('Geolocation is not supported by your browser'));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => {
          const messages = {
            1: 'Location access denied by user',
            2: 'Location information unavailable',
            3: 'Location request timed out',
          };
          reject(new Error(messages[error.code] || 'Unable to retrieve location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // 5 minutes
        }
      );
    });
  }, []);

  // Fetch weather from OpenWeatherMap API
  const fetchWeather = useCallback(async (coords: GeolocationCoords) => {
    const { latitude, longitude } = coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.weather || data.weather.length === 0) {
      throw new Error('Invalid weather data received');
    }

    const weatherDetails = data.weather[0];

    const weatherData: WeatherData = {
      temperature: Math.round(data.main.temp),
      condition: weatherDetails.description,
      icon: weatherDetails.icon,
      location: data.name,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      feelsLike: Math.round(data.main.feels_like),
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
    };

    setWeather(weatherData);
    setError(null);
  }, [API_KEY]);

  // Load weather for current location
  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      await fetchWeather(coords);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load weather';
      setError(message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation, fetchWeather]);

  // Refresh weather (reuse last known location)
  const refreshWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (location) {
        await fetchWeather(location);
      } else {
        await loadWeather();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh weather';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [location, fetchWeather, loadWeather]);

  // Auto-load on mount
  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return {
    weather,
    loading,
    error,
    loadWeather,
    refreshWeather,
  };
};
