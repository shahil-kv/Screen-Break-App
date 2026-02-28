/**
 * ScreenBreak SDK
 * 
 * This is the bridge between the Core App and community extensions.
 */

export interface ScreenTimeStats {
    todayTotalMinutes: number;
    appUsage: Record<string, number>; // bundleId -> minutes
}

export interface VisualsAPI {
    /**
     * Sets the grayscale level of the screen (Android only).
     * @param level - From 0.0 (Coloured) to 1.0 (Black & White)
     */
    setGrayscale: (level: number) => Promise<void>;

    /**
     * Toggles the "Night Mode" filter.
     */
    setBlueLightFilter: (enabled: boolean) => Promise<void>;
}

export interface ChallengesAPI {
    /**
     * Shows a full-screen "Challenge" overlay.
     * @param component - The ID of a pre-built challenge UI (e.g., 'duolingo', 'shake')
     */
    triggerChallenge: (componentId: string) => Promise<boolean>;

    /**
     * Force blocks a specific application.
     */
    blockApp: (bundleId: string) => Promise<void>;
}

export interface ScreenBreakSDK {
    stats: ScreenTimeStats;
    visuals: VisualsAPI;
    challenges: ChallengesAPI;

    /**
     * Subscribes to time/usage updates.
     */
    onUpdate: (callback: (stats: ScreenTimeStats) => void) => () => void;
}

// Global instance exposed to extensions
export const ScreenBreak: ScreenBreakSDK = (global as any).ScreenBreak;
