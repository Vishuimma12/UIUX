import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';

interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationCoords | null>(null);

  // Get user's current location
  const getCurrentLocation = useCallback((): Promise<GeolocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Fetch weather data from OpenWeatherMap API
  const fetchWeather = useCallback(async (coords: GeolocationCoords) => {
    const API_KEY = '2c8d5b5d4c8f4a5e9b2f1a3c7d9e6f8a'; // Demo API key - replace with your own
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=imperial`;

    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        location: `${data.name}, ${data.sys.country}`,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        feelsLike: Math.round(data.main.feels_like),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min)
      };

      setWeather(weatherData);
      setError(null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      
      // Fallback to demo data if API fails
      setWeather({
        temperature: 72,
        condition: 'Partly Cloudy',
        location: 'San Francisco, US',
        icon: '02d',
        humidity: 65,
        windSpeed: 8,
        feelsLike: 75,
        high: 75,
        low: 65
      });
    }
  }, []);

  // Main function to get weather
  const getWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      await fetchWeather(coords);
    } catch (err) {
      console.error('Location error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get location');
      
      // Fallback to demo data
      setWeather({
        temperature: 72,
        condition: 'Partly Cloudy',
        location: 'Demo Location',
        icon: '02d',
        humidity: 65,
        windSpeed: 8,
        feelsLike: 75,
        high: 75,
        low: 65
      });
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation, fetchWeather]);

  // Auto-fetch weather on mount
  useEffect(() => {
    getWeather();
  }, [getWeather]);

  // Refresh weather data
  const refreshWeather = useCallback(() => {
    if (location) {
      setLoading(true);
      fetchWeather(location).finally(() => setLoading(false));
    } else {
      getWeather();
    }
  }, [location, fetchWeather, getWeather]);

  return {
    weather,
    loading,
    error,
    refreshWeather,
    getWeather
  };
};