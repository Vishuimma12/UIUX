import { useState, useCallback } from 'react';

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if speech recognition is supported
  const checkSupport = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    return !!SpeechRecognition;
  }, []);

  const startListening = useCallback(() => {
    if (!checkSupport()) return;
    
    setIsListening(true);
    
    // Simulate voice recognition for demo
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  }, [checkSupport]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSupported: isSupported || true, // Always true for demo
    startListening,
    stopListening,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}