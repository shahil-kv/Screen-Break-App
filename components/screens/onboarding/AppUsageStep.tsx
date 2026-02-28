import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { getUsageStats, getInstalledApps } from '../../../modules/screen-time';
import { formatDuration } from '../../../utils/screenTimeData';

interface AppUsageStepProps {
  onNext: () => void;
  preFetchedData?: any; // The raw or processed usage data
  preFetchedApps?: any[]; // The list of installed apps
}

interface AppStats {
  packageName: string;
  label: string;
  icon: string | null;
  duration: number; // in seconds
}

export const AppUsageStep: React.FC<AppUsageStepProps> = ({ 
  onNext,
  preFetchedData,
  preFetchedApps
}) => {
  const [loading, setLoading] = useState(!(preFetchedData && preFetchedApps));
  const [topApps, setTopApps] = useState<AppStats[]>([]);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (preFetchedData && preFetchedApps) {
      processData(preFetchedData.daily || preFetchedData, preFetchedApps);
      setLoading(false);
      return;
    }
    fetchData();
  }, [preFetchedData, preFetchedApps]);

  const processData = (dailyStats: any, allApps: any[]) => {
    const appMap = new Map<string, { label: string, icon: string }>();
    allApps.forEach(app => {
      appMap.set(app.packageName, { label: app.label, icon: app.icon });
    });

    // Combine and sort
    const processedApps: AppStats[] = Object.entries(dailyStats)
      .map(([pkg, duration]) => {
        const appInfo = appMap.get(pkg);
        return {
          packageName: pkg,
          label: appInfo?.label || pkg.split('.').pop() || 'Unknown',
          icon: appInfo?.icon || null,
          duration: (duration as number) / 1000
        };
      })
      .filter(app => app.duration > 60) // At least 1 minute
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    setTopApps(processedApps);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const end = now.getTime();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();

      const [usageData, installedApps] = await Promise.all([
        getUsageStats(start, end),
        getInstalledApps()
      ]);

      processData(usageData.daily || {}, installedApps);
    } catch (e) {
      console.error("Failed to fetch app usage data", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#ff006e" size="large" />
      </View>
    );
  }

  const maxDuration = topApps.length > 0 ? topApps[0].duration : 1;

  return (
    <View className="flex-1 bg-black pt-6 pb-6 px-6">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="items-center w-full mb-8">
            {/* Eyes Illustration */}
            <View className="flex-row space-x-8 mb-6">
                <View className="w-20 h-10 bg-gray-600 rounded-t-full overflow-hidden relative">
                    <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
                </View>
                <View className="w-20 h-10 bg-gray-600 rounded-t-full overflow-hidden relative">
                    <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
                </View>
            </View>

            <Text className="text-4xl font-bold text-center text-white mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                Where your time goes
            </Text>
            <Text className="text-lg text-gray-500" style={{ fontFamily: 'Outfit_400Regular' }}>
                Top apps for the last 7 days
            </Text>
        </View>

        <View className="space-y-8 pb-10">
          {topApps.map((app, index) => {
            const progress = app.duration / maxDuration;
            const barWidth = (width - 120) * progress;
            const isTop = index === 0;

            return (
              <View key={app.packageName} className="w-full">
                <Text className="text-white text-lg font-bold mb-3" style={{ fontFamily: 'Outfit_700Bold' }}>
                  No. {index + 1}
                </Text>
                
                <View className="flex-row items-center space-x-4 mb-2">
                  <View className="w-10 h-10 rounded-xl mr-3 bg-gray-800 overflow-hidden items-center justify-center">
                    {app.icon ? (
                      <Image 
                        source={{ uri: `data:image/png;base64,${app.icon}` }} 
                        className="w-8 h-8"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="w-6 h-6 bg-gray-600 rounded-md" />
                    )}
                  </View>
                  
                  <View 
                    style={{ 
                      width: Math.max(barWidth, 40), 
                      height: 36, 
                      backgroundColor: isTop ? '#ff453a' : '#ffb6c1',
                      borderRadius: 18,
                    }} 
                  />
                </View>

                <View className="flex-row justify-between items-center ml-1">
                  <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                    {app.label}
                  </Text>
                  <Text className="text-gray-400 text-lg" style={{ fontFamily: 'Outfit_400Regular' }}>
                    {formatDuration(app.duration)}
                  </Text>
                </View>
                
                {index < topApps.length - 1 && (
                    <View className="h-[0.5px] bg-gray-800 w-full mt-6" />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={onNext}
        className="w-full rounded-full bg-[#ff006e] py-5 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
      >
        <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};
