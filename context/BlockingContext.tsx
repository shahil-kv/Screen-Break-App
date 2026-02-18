import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useBreakTimer, TimerState } from '../hooks/useBreakTimer';

interface BlockingContextType {
  isBlocked: boolean;
  timerState: TimerState;
  timeLeft: number;
  progress: number;
  isStrict: boolean;
  setStrict: (strict: boolean) => void;
  usageLimit: number; // seconds
  breakLimit: number; // seconds
  setUsageLimit: (limit: number) => void;
  setBreakLimit: (limit: number) => void;
  skipBreak: () => void;
  resetTimer: () => void;
  triggerDemoBlock: () => void;
}

const BlockingContext = createContext<BlockingContextType | undefined>(undefined);

export const BlockingProvider = ({ children }: { children: ReactNode }) => {
  const [isStrict, setStrict] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Default: 15 minutes usage (900s), 1 minute break (60s)
  // For testing/demo, we might want shorter defaults, but let's stick to the prompt.
  // Prompt says: "15 minutes of detected usage... 1 minute break"
  // Let's use 15m/1m as default but maybe start with smaller for dev if needed.
  // I will use 15 * 60 and 60 for production-like values.
  const {
    timerState,
    timeLeft,
    progress,
    usageLimit,
    breakLimit,
    setUsageLimit,
    setBreakLimit,
    resetTimer,
    skipBreak: skipBreakTimer,
  } = useBreakTimer({
    initialUsageLimit: 15 * 60,
    initialBreakLimit: 60,
    onBreakStart: () => setIsBlocked(true),
    onBreakEnd: () => setIsBlocked(false),
  });

  const skipBreak = () => {
    if (isStrict) return; // Cannot skip in strict mode
    skipBreakTimer();
  };

  const triggerDemoBlock = () => {
      // Logic for demo: Start a short 10s break to show the overlay
      setBreakLimit(10); 
      // We need to trigger the break start. 
      // The hook might not expose a manual start. 
      // Let's just manually set blocked for now, or use resetTimer if that starts it?
      // Actually, useBreakTimer usually starts automatically if usage limit reached.
      // Let's just force the state for demo purposes.
      setIsBlocked(true);
      
      // Auto-dismiss after 10s if timer doesn't handle it
      // But the timer hook should handle it if we sync them. 
      // For now, let's just use simple state for the demo.
      setTimeout(() => {
          setIsBlocked(false);
      }, 10000);
  };

  return (
    <BlockingContext.Provider
      value={{
        isBlocked,
        timerState,
        timeLeft,
        progress,
        isStrict,
        setStrict,
        usageLimit,
        breakLimit,
        setUsageLimit,
        setBreakLimit,
        skipBreak,
        resetTimer,
        triggerDemoBlock
      }}
    >
      {children}
    </BlockingContext.Provider>
  );
};

export const useBlocking = () => {
  const context = useContext(BlockingContext);
  if (!context) {
    throw new Error('useBlocking must be used within a BlockingProvider');
  }
  return context;
};
