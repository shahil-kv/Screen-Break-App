import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppUsage, formatDuration } from '../../utils/screenTimeData';

interface AppListItemProps {
  app: AppUsage;
  isSelected: boolean;
  onPress: (appId: string) => void;
}

// Memoized Individual App Item to prevent re-rendering entire list when one item changes selection
const AppListItem = memo(({ app, isSelected, onPress }: AppListItemProps) => {
  const appColor = app.color || "#3b82f6"; // Default to blue-500 like the screenshot
  const maxDuration = 3600 * 2; // Assume 2h max for progress bar scaling, or dynamic? using static 100% for now relative to something? 
  // Actually, standard progress bars usually relative to total time or a max value. 
  // For individual app list, maybe just visual logic? 
  // Screenshot shows bar filling up. Let's assume max is relative to 1 hour or the app's own scale? 
  // Screenshot: "36m" bar is about 60%. So maybe 1 hour scale.

  return (
    <TouchableOpacity 
      onPress={() => onPress(app.id)}
      className={`mb-3 p-4 rounded-3xl ${isSelected ? 'bg-zinc-800 border border-zinc-600' : 'bg-zinc-900'}`}
    >
      {/* Header: Icon + Name */}
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-lg overflow-hidden mr-3">
            {app.icon.startsWith('data:') ? (
                <Image 
                    source={{ uri: app.icon }} 
                    style={{ width: '100%', height: '100%' }} 
                    resizeMode="cover"
                />
            ) : (
                <Ionicons name="apps" size={20} color="white" />
            )}
        </View>
        <Text className="text-white font-bold text-lg">{app.name}</Text>
      </View>

      {/* Progress Bar Row */}
      <View className="flex-row items-center mb-3">
        {/* Bar Track */}
        <View className="flex-1 h-2 bg-zinc-800 rounded-full mr-3 overflow-hidden">
            <View 
                className="h-full rounded-full"
                style={{ 
                    width: `${Math.min(100, (app.duration / 3600) * 100)}%`, // 1 hour scale
                    backgroundColor: appColor
                }} 
            />
        </View>
        {/* Time Text */}
        <Text className="text-white font-bold text-base">{formatDuration(app.duration)}</Text>
      </View>

      {/* Stats Row */}
      <View className="flex-row items-center">
        {/* Pickups */}
        <View className="flex-row items-center mr-6">
            <Ionicons name="phone-portrait-outline" size={14} color="#9ca3af" style={{ marginRight: 4 }} />
            <Text className="text-gray-400 text-xs">{app.pickups || 0} pickups</Text>
        </View>
        
      </View>
    </TouchableOpacity>
  );
});

AppListItem.displayName = 'AppListItem';

interface AppUsageListProps {
  apps: AppUsage[];
  selectedAppId: string | null;
  onAppPress: (appId: string) => void;
}

export const AppUsageList = memo(({ apps, selectedAppId, onAppPress }: AppUsageListProps) => {
  return (
    <View className="mt-2">
      {apps.map((app, index) => (
        <AppListItem 
          key={`${app.id}-${index}`}
          app={app}
          isSelected={selectedAppId === app.id}
          onPress={onAppPress}
        />
      ))}
      {apps.length === 0 && (
        <Text className="text-gray-500 text-center mt-4">No activity recorded</Text>
      )}
    </View>
  );
});

AppUsageList.displayName = 'AppUsageList';
