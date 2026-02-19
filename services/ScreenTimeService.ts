import { Platform } from 'react-native';
import * as ScreenTimeModule from '../modules/screen-time';
import { DailyUsage, HourlyUsage, AppUsage } from '../utils/screenTimeData';

const CACHE_DURATION = 60 * 1000; // 1 minute cache
let appCache: { [packageName: string]: string } | null = null;

export const ScreenTimeService = {
    async hasPermission(): Promise<boolean> {
        if (Platform.OS !== 'android') return true; // Mock true for iOS for now or handle differently
        return await ScreenTimeModule.hasPermission();
    },

    async requestPermission(): Promise<void> {
        if (Platform.OS !== 'android') return;
        ScreenTimeModule.requestPermission();
    },

    async getInstalledApps(): Promise<{ [packageName: string]: string }> {
        if (appCache) return appCache;

        if (Platform.OS !== 'android') return {};

        try {
            const apps = await ScreenTimeModule.getInstalledApps();
            const map: { [packageName: string]: string } = {};
            apps.forEach(app => {
                map[app.packageName] = app.label;
            });
            appCache = map;
            return map;
        } catch (e) {
            console.error("Failed to get installed apps", e);
            return {};
        }
    },

    async getDailyUsage(dateTimestamp: number): Promise<DailyUsage> {
        if (Platform.OS !== 'android') {
            // Return mock data for non-Android
            // logic to find mock data for date
            return {
                date: new Date(dateTimestamp).getDate(),
                totalDuration: 0,
                hourly: []
            };
        }

        const startOfDay = new Date(dateTimestamp);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateTimestamp);
        endOfDay.setHours(23, 59, 59, 999);

        try {
            const usageStats = await ScreenTimeModule.getUsageStats(startOfDay.getTime(), endOfDay.getTime());
            const appMap = await this.getInstalledApps();

            const appsList: AppUsage[] = [];
            let totalDuration = 0;

            Object.keys(usageStats).forEach(packageName => {
                const timeInMillis = usageStats[packageName];
                const durationSeconds = Math.floor(timeInMillis / 1000);

                if (durationSeconds > 0) {
                    totalDuration += durationSeconds;
                    appsList.push({
                        id: packageName,
                        name: appMap[packageName] || packageName,
                        icon: 'apps', // Default icon for now
                        duration: durationSeconds,
                        category: 'Unknown',
                        color: '#8b5cf6' // Default purple
                    });
                }
            });

            // Sort by duration
            appsList.sort((a, b) => b.duration - a.duration);

            // Populate hourly data (Note: Android Daily stats don't give hourly breakdown easily without more complex querying)
            // For now, we will put everything in a single "Daily" bucket or distribute it evenly/mock hourly to fit UI
            // REAL IMPLEMENTATION: We would need to query events to get hourly breakdown.
            // For MVP: We will create a single "All Day" hourly block or distribute proportionally.

            // Let's create a fake hourly distribution for the chart to look okay for now
            // or just put it all in "12 PM" if we don't want to fake it.
            // Better: Query events in native module for hourly. But for now, let's just show total in Top Apps
            // and maybe flat chart or simplified.

            // Simulating hourly for UI compatibility
            const hourly: HourlyUsage[] = Array(24).fill(null).map((_, i) => ({
                hour: i,
                totalDuration: 0,
                apps: []
            }));

            // Distribute total duration across hours roughly (just for visual if we lack real hourly data yet)
            // Ideally we improve native module to `queryEvents` later.

            return {
                date: startOfDay.getDate(),
                totalDuration,
                hourly,
                apps: appsList // Return the aggregated list
            };

        } catch (e) {
            console.error("Failed to fetch usage stats", e);
            return {
                date: startOfDay.getDate(),
                totalDuration: 0,
                hourly: []
            };
        }
    }
};
