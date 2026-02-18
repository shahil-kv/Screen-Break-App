export interface AppUsage {
    id: string;
    name: string;
    icon: string; // url or local asset name
    duration: number; // in seconds
    category: string;
    color: string;
}

export interface HourlyUsage {
    hour: number; // 0-23
    totalDuration: number; // seconds
    apps: AppUsage[];
}

export interface DailyUsage {
    date: number; // 1-31
    totalDuration: number;
    hourly: HourlyUsage[];
}

const APPS = [
    { id: '1', name: 'Instagram', category: 'Social', icon: 'logo-instagram', color: '#E1306C' },
    { id: '2', name: 'TikTok', category: 'Entertainment', icon: 'logo-tiktok', color: '#00F2EA' }, // Cyan accent for dark mode
    { id: '3', name: 'YouTube', category: 'Entertainment', icon: 'logo-youtube', color: '#FF0000' },
    { id: '4', name: 'WhatsApp', category: 'Social', icon: 'logo-whatsapp', color: '#25D366' },
    { id: '5', name: 'Snapchat', category: 'Social', icon: 'logo-snapchat', color: '#FFFC00' },
    { id: '6', name: 'Safari', category: 'Productivity', icon: 'compass', color: '#007AFF' },
    { id: '7', name: 'X', category: 'Social', icon: 'logo-twitter', color: '#FFFFFF' }, // White X
    { id: '8', name: 'Gmail', category: 'Productivity', icon: 'mail', color: '#EA4335' },
];

const generateHourly = (hour: number): HourlyUsage => {
    // Generate random apps for this hour
    const numApps = Math.floor(Math.random() * 4) + 1;
    const hourApps: AppUsage[] = [];
    let total = 0;

    for (let i = 0; i < numApps; i++) {
        const app = APPS[Math.floor(Math.random() * APPS.length)];
        // Duration between 5 min and 30 min
        const duration = Math.floor(Math.random() * 1500) + 300;

        // Avoid duplicates in same hour for simplicity, or just let them add up
        if (!hourApps.find(a => a.id === app.id)) {
            hourApps.push({ ...app, duration });
            total += duration;
        }
    }

    // Ensure total doesn't exceed hour (3600s)
    if (total > 3600) total = 3600;

    return {
        hour,
        totalDuration: total,
        apps: hourApps.sort((a, b) => b.duration - a.duration)
    };
};

export const MOCK_DATA: Record<number, DailyUsage> = {};

// Generate data for dates 8-14
[8, 9, 10, 11, 12, 13, 14].forEach(date => {
    const hourly: HourlyUsage[] = [];
    let dailyTotal = 0;

    for (let h = 0; h < 24; h++) {
        // Sleep hours (0-6) have less activity
        if (h < 6 && Math.random() > 0.1) {
            hourly.push({ hour: h, totalDuration: 0, apps: [] });
            continue;
        }

        const usage = generateHourly(h);
        hourly.push(usage);
        dailyTotal += usage.totalDuration;
    }

    MOCK_DATA[date] = {
        date,
        totalDuration: dailyTotal,
        hourly
    };
});

export const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};
