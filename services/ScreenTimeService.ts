import { Platform } from 'react-native';
import * as ScreenTimeModule from '../modules/screen-time';
import { DailyUsage, HourlyUsage, AppUsage } from '../utils/screenTimeData';

const CACHE_DURATION = 60 * 1000; // 1 minute cache
let appCache: { [packageName: string]: { label: string; icon: string } } | null = null;

export const ScreenTimeService = {
    async hasPermission(): Promise<boolean> {
        if (Platform.OS !== 'android') return true; // Mock true for iOS for now or handle differently
        return await ScreenTimeModule.hasPermission();
    },

    async requestPermission(): Promise<void> {
        if (Platform.OS !== 'android') return;
        ScreenTimeModule.requestPermission();
    },

    async getInstalledApps(): Promise<{ [packageName: string]: { label: string; icon: string } }> {
        if (appCache) return appCache;

        if (Platform.OS !== 'android') return {};

        try {
            const apps = await ScreenTimeModule.getInstalledApps();
            const map: { [packageName: string]: { label: string; icon: string } } = {};
            apps.forEach(app => {
                map[app.packageName] = {
                    label: app.label,
                    icon: app.icon
                };
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
            // startTime, endTime
            const result = await ScreenTimeModule.getUsageStats(startOfDay.getTime(), endOfDay.getTime()) as {
                hourly?: Record<string, Record<string, number>>;
                daily?: Record<string, number>;
            };



            const hourlyMapNative: Record<string, Record<string, number>> = result.hourly || {};
            const dailyTotalMapNative: Record<string, number> = result.daily || {};
            const pickupMapNative: Record<string, number> = (result as any).pickups || {};

            const appMap = await this.getInstalledApps();

            // Blocklist: System apps to exclude from time calculation
            // To match Digital Wellbeing:
            // 1. BLOCK Launchers (Home Screen)
            // 2. ALLOW Settings
            const SYSTEM_PACKAGES = [
                'com.sec.android.app.launcher', // Samsung One UI Home - BLOCK
                'com.android.launcher', // Generic Launcher - BLOCK
                'com.google.android.apps.nexuslauncher', // Pixel Launcher - BLOCK
                'com.android.systemui', // Status bar / Notification shade - BLOCK
                // 'com.android.settings', // Settings - ALLOW
                // 'com.android.settings.intelligence', // Settings Suggestions - ALLOW
                'com.samsung.android.lool', // Device Care - BLOCK (Background service usually)
                'android', // System Resources - BLOCK
                'com.google.android.googlequicksearchbox', // Google App/Discover - BLOCK (Often background/feed)
                'com.samsung.android.app.galaxyfinder', // Finder - BLOCK
                'com.samsung.android.forest', // Samsung Digital Wellbeing - BLOCK (OS doesn't count itself)
                'com.google.android.apps.wellbeing' // Google Digital Wellbeing - BLOCK
            ];

            const isSystemApp = (pkg: string) => {
                // Block if it's in the list
                return SYSTEM_PACKAGES.includes(pkg);
            };

            // 1. Process Hourly Data
            const hourlyUsage: HourlyUsage[] = [];
            for (let h = 0; h < 24; h++) {
                const hourKey = h.toString();
                const hourAppsNative = hourlyMapNative[hourKey] || {};

                const hourApps: AppUsage[] = [];
                let hourTotal = 0;

                Object.keys(hourAppsNative).forEach(pkg => {
                    if (isSystemApp(pkg)) return; // Skip system apps

                    const timeMs = hourAppsNative[pkg];
                    const seconds = Math.floor(timeMs / 1000);

                    if (seconds > 60) { // Filter out < 1 minute usage to reduce noise
                        const appPickups = pickupMapNative[pkg] || 0;
                        hourTotal += seconds;
                        hourApps.push({
                            id: pkg,
                            name: appMap[pkg]?.label || pkg,
                            icon: appMap[pkg]?.icon
                                ? `data:image/png;base64,${appMap[pkg].icon}`
                                : 'apps',
                            duration: seconds,
                            category: 'Unknown',
                            color: '#8b5cf6',
                            pickups: appPickups,
                            notifications: 0 // Placeholder
                        });
                    }
                });

                hourApps.sort((a, b) => b.duration - a.duration);

                hourlyUsage.push({
                    hour: h,
                    totalDuration: hourTotal,
                    apps: hourApps
                });
            }

            // 2. Process Daily Aggregated Apps
            const allDayApps: AppUsage[] = [];
            let totalDailyDuration = 0;

            Object.keys(dailyTotalMapNative).forEach(pkg => {
                if (isSystemApp(pkg)) return; // Skip blocked system apps

                const timeMs = dailyTotalMapNative[pkg];
                const seconds = Math.floor(timeMs / 1000);

                if (seconds > 60) { // Filter out < 1 minute usage
                    totalDailyDuration += seconds; // Include EVERYTHING (even launchers if they passed isSystemApp)

                    // Exclude Launchers from the visualization list
                    const isLauncher = pkg.includes('launcher') || pkg.includes('home');
                    if (isLauncher) return;

                    const appPickups = pickupMapNative[pkg] || 0;
                    allDayApps.push({
                        id: pkg,
                        name: appMap[pkg]?.label || pkg,
                        icon: appMap[pkg]?.icon
                            ? `data:image/png;base64,${appMap[pkg].icon}`
                            : 'apps',
                        duration: seconds,
                        category: 'Unknown',
                        color: '#ec4899', // Pink default
                        pickups: appPickups,
                        notifications: 0 // Placeholder
                    });
                }
            });

            // Sort Daily Apps: Most used first
            allDayApps.sort((a, b) => b.duration - a.duration);

            // Get total pickups from special key
            const totalPickupsValid = pickupMapNative["total_pickups"] || 0;

            return {
                date: startOfDay.getDate(),
                totalDuration: totalDailyDuration,
                hourly: hourlyUsage,
                apps: allDayApps,
                pickups: totalPickupsValid
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
