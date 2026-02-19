import { requireNativeModule } from 'expo-modules-core';

// Define the native module interface
interface ScreenTimeModuleInterface {
    hasPermission(): Promise<boolean>;
    requestPermission(): void;
    getUsageStats(startTime: number, endTime: number): Promise<any>; // Returns complex object
    getInstalledApps(): Promise<{ packageName: string, label: string, icon: string }[]>;
}

// Get the native module
const ScreenTimeModule = requireNativeModule<ScreenTimeModuleInterface>('ScreenTime');

export default ScreenTimeModule;

export async function hasPermission(): Promise<boolean> {
    return await ScreenTimeModule.hasPermission();
}

export function requestPermission(): void {
    ScreenTimeModule.requestPermission();
}

export async function getUsageStats(startTime: number, endTime: number): Promise<any> {
    return await ScreenTimeModule.getUsageStats(startTime, endTime);
}

export async function getInstalledApps(): Promise<{ packageName: string, label: string, icon: string }[]> {
    return await ScreenTimeModule.getInstalledApps();
}
