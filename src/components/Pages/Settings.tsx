import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Smartphone,
  Bell,
  Mic,
  Shield,
  Palette,
  Volume2,
  Globe
} from 'lucide-react';
import Card from '../UI/Card';
import { Settings as SettingsType } from '../../types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType>({
    theme: 'dark',
    voiceEnabled: true,
    personalityType: 'friendly',
    notificationsEnabled: true
  });

  const updateSetting = <K extends keyof SettingsType>(
    key: K, 
    value: SettingsType[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsGroups = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select' as const,
          value: settings.theme,
          options: [
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'auto', label: 'Auto', icon: Smartphone }
          ],
          onChange: (value: string) => updateSetting('theme', value as SettingsType['theme'])
        }
      ]
    },
    {
      title: 'Voice & Audio',
      icon: Mic,
      settings: [
        {
          label: 'Voice Input',
          description: 'Enable voice commands and interactions',
          type: 'toggle' as const,
          value: settings.voiceEnabled,
          onChange: (value: boolean) => updateSetting('voiceEnabled', value)
        },
        {
          label: 'Assistant Personality',
          description: 'Choose how ARIA communicates with you',
          type: 'select' as const,
          value: settings.personalityType,
          options: [
            { value: 'professional', label: 'Professional' },
            { value: 'friendly', label: 'Friendly' },
            { value: 'casual', label: 'Casual' }
          ],
          onChange: (value: string) => updateSetting('personalityType', value as SettingsType['personalityType'])
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          label: 'Push Notifications',
          description: 'Receive alerts for reminders and tasks',
          type: 'toggle' as const,
          value: settings.notificationsEnabled,
          onChange: (value: boolean) => updateSetting('notificationsEnabled', value)
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <SettingsIcon className="text-purple-400" size={24} />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-white/70">Customize your ARIA experience</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card gradient>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full flex items-center justify-center border border-white/20">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Alex Johnson</h2>
              <p className="text-white/60">Premium User</p>
              <p className="text-white/50 text-sm">Member since March 2024</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + groupIndex * 0.1 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <group.icon className="text-purple-400" size={20} />
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
              </div>

              <div className="space-y-4">
                {group.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{setting.label}</h4>
                      <p className="text-white/60 text-sm">{setting.description}</p>
                    </div>

                    <div className="ml-4">
                      {setting.type === 'toggle' ? (
                        <button
                          onClick={() => setting.onChange(!setting.value)}
                          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                            setting.value 
                              ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                              : 'bg-white/20'
                          }`}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                            animate={{ x: setting.value ? 26 : 2 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                          />
                        </button>
                      ) : (
                        <select
                          value={setting.value}
                          onChange={(e) => setting.onChange(e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 min-w-[120px]"
                        >
                          {setting.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Options */}
      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <div className="flex items-center space-x-3">
            <Shield className="text-green-400" size={20} />
            <div className="flex-1">
              <h4 className="text-white font-medium">Privacy & Security</h4>
              <p className="text-white/60 text-sm">Manage your data and privacy settings</p>
            </div>
            <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Configure
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <Volume2 className="text-yellow-400" size={20} />
            <div className="flex-1">
              <h4 className="text-white font-medium">Audio Settings</h4>
              <p className="text-white/60 text-sm">Adjust voice recognition and playback</p>
            </div>
            <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Adjust
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <Globe className="text-blue-400" size={20} />
            <div className="flex-1">
              <h4 className="text-white font-medium">Language & Region</h4>
              <p className="text-white/60 text-sm">Set your preferred language and location</p>
            </div>
            <button className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Change
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <p className="text-white/50 text-sm">
          ARIA v2.1.0 • Made with ❤️ for productivity
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;