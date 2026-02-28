import React from 'react';
import { ScreenBreakSDK, ScreenTimeStats } from './index';
import * as ScreenTimeModule from '../../modules/screen-time';

/**
 * SDK Provider (Internal)
 * 
 * This is the actual implementation of the ScreenBreak SDK that the app injects.
 */

let listeners: ((stats: ScreenTimeStats) => void)[] = [];

const SDKProviderInstance: ScreenBreakSDK = {
  stats: {
    todayTotalMinutes: 0,
    appUsage: {},
  },
  
  visuals: {
    setGrayscale: async (level: number) => {
      console.log(`[SDK] Setting Grayscale to: ${level}`);
      // Here we would call the Native Module's Accessibility Service
      // For now, we mock it.
    },
    setBlueLightFilter: async (enabled: boolean) => {
      console.log(`[SDK] Blue Light Filter: ${enabled}`);
    }
  },
  
  challenges: {
    triggerChallenge: async (id: string) => {
      console.log(`[SDK] Triggering Challenge: ${id}`);
      return true;
    },
    blockApp: async (bundleId: string) => {
      console.log(`[SDK] Blocking App: ${bundleId}`);
    }
  },
  
  onUpdate: (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  }
};

/**
 * Updates the SDK state and notifies all extensions.
 */
export const updateSDKState = (newStats: ScreenTimeStats) => {
  SDKProviderInstance.stats = newStats;
  listeners.forEach(cb => cb(newStats));
};

// Inject into global scope for extensions
(global as any).ScreenBreak = SDKProviderInstance;

export const useSDK = () => SDKProviderInstance;
