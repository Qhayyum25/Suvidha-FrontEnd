import { useState, useCallback } from 'react';

export function useNavigation(initialScreen = 'landing') {
  const [screen, setScreen] = useState(initialScreen);
  const [history, setHistory] = useState([]);

  const go = useCallback((newScreen) => {
    if (newScreen === screen) return;
    setHistory(prev => [...prev, screen]);
    setScreen(newScreen);
  }, [screen]);

  const back = useCallback(() => {
    const newHistory = [...history];
    const prevScreen = newHistory.pop();
    if (prevScreen) {
      setHistory(newHistory);
      setScreen(prevScreen);
    }
  }, [history]);

  const home = useCallback(() => {
    setHistory([]);
    setScreen(initialScreen);
  }, [initialScreen]);

  return { screen, setScreen, history, go, back, home, canGoBack: history.length > 0 };
}