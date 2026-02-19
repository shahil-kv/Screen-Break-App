import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppUsage, formatDuration } from '../../utils/screenTimeData';

interface AppListItemProps {
  app: AppUsage;
  isSelected: boolean;
  onPress: (appId: string) => void;
}

// Memoized Individual App Item to prevent re-rendering entire list when one item changes selection
const AppListItem = memo(({ app, isSelected, onPress }: AppListItemProps) => {
  const appColor = app.color || "#ffffff"; 

  return (
    <TouchableOpacity 
      onPress={() => onPress(app.id)}
      // Use transparent background for unselected items to blend with card
      className={`flex-row items-center mb-4 p-3 rounded-2xl ${isSelected ? 'bg-zinc-800 border-2' : 'bg-transparent border border-transparent'}`}
      style={{ borderColor: isSelected ? appColor : 'transparent' }}
    >
      {/* Icon Placeholder */}
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: isSelected ? appColor : '#27272a' /* zinc-800 */ }}
      >
        <Ionicons name={app.icon as any || "apps"} size={20} color={isSelected ? "white" : appColor} />
      </View>
      
      <View className="flex-1">
        <Text className="text-white font-bold text-base">{app.name}</Text>
        <Text className="text-gray-500 text-xs">{app.category}</Text>
      </View>

      <View className="items-end">
        <Text className="text-white font-bold">{formatDuration(app.duration)}</Text>
        <View className="w-20 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
          <View 
            className="h-full rounded-full"
            style={{ 
              width: `${Math.min(100, (app.duration / 3600) * 100)}%`,
              backgroundColor: appColor
            }} 
          />
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
