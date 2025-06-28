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
    const API_KEY = '0a29ca5c1fd8703e7253eff202b7358f'; // Your OpenWeatherMap API key
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=imperial`;

    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        feelsLike: Math.round(data.main.feels_like),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min)
      };

      setWeather(weatherData);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      setWeather(null);
    }
  }, []);

  // Load weather data
  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      await fetchWeather(coords);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation, fetchWeather]);

  // Refresh weather data
  const refreshWeather = useCallback(async () => {
    if (location) {
      setLoading(true);
      setError(null);
      try {
        await fetchWeather(location);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to refresh weather';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      await loadWeather();
    }
  }, [location, fetchWeather, loadWeather]);

  return {
    weather,
    loading,
    error,
    loadWeather,
    refreshWeather
  };
};