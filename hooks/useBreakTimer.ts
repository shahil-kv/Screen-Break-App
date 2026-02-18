import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerState = 'USAGE' | 'BREAK';

interface UseBreakTimerProps {
  initialUsageLimit: number; // in seconds
  initialBreakLimit: number; // in seconds
  onBreakStart?: () => void;
  onBreakEnd?: () => void;
}

export const useBreakTimer = ({
  initialUsageLimit,
  initialBreakLimit,
  onBreakStart,
  onBreakEnd,
}: UseBreakTimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>('USAGE');
  const [timeLeft, setTimeLeft] = useState(initialUsageLimit);
  const [isActive, setIsActive] = useState(true);

  // Store limits in state to allow dynamic updates
  const [usageLimit, setUsageLimit] = useState(initialUsageLimit);
  const [breakLimit, setBreakLimit] = useState(initialBreakLimit);

  const resetTimer = useCallback(() => {
    setTimerState('USAGE');
    setTimeLeft(usageLimit);
    setIsActive(true);
  }, [usageLimit]);

  const skipBreak = useCallback(() => {
    if (timerState === 'BREAK') {
      setTimerState('USAGE');
      setTimeLeft(usageLimit);
      onBreakEnd?.();
    }
  }, [timerState, usageLimit, onBreakEnd]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished, we'll handle transition in the effect below
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  // Handle state transitions when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0) {
      if (timerState === 'USAGE') {
        // Switch to BREAK
        setTimerState('BREAK');
        setTimeLeft(breakLimit);
        onBreakStart?.();
      } else {
        // Switch back to USAGE
        setTimerState('USAGE');
        setTimeLeft(usageLimit);
        onBreakEnd?.();
      }
    }
  }, [timeLeft, timerState, breakLimit, usageLimit, onBreakStart, onBreakEnd]);

  return {
    timerState,
    timeLeft,
    progress:
      timerState === 'USAGE'
        ? 1 - timeLeft / usageLimit
        : 1 - timeLeft / breakLimit,
    usageLimit,
    breakLimit,
    setUsageLimit,
    setBreakLimit,
    resetTimer,
    skipBreak,
    setIsActive,
    isActive,
  };
};
