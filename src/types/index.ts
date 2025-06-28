export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'voice';
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  feelsLike?: number;
  high?: number;
  low?: number;
}

export type Theme = 'light' | 'dark' | 'auto';

export interface Settings {
  theme: Theme;
  voiceEnabled: boolean;
  personalityType: 'professional' | 'friendly' | 'casual';
  notificationsEnabled: boolean;
}