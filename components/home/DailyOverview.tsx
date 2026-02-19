import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyUsage, formatDuration } from '../../utils/screenTimeData';

interface Props {
  dailyData?: DailyUsage;
  selectedAppId: string | null;
  selectedAppDuration: number;
  onClearAppSelection: () => void;
}

export const DailyOverview = memo(({
  dailyData,
  selectedAppId,
  selectedAppDuration,
  onClearAppSelection
}: Props) => {
  const displayDuration = selectedAppId 
    ? formatDuration(selectedAppDuration) 
    : (dailyData ? formatDuration(dailyData.totalDuration) : "0m");

  const progressPercent = Math.min(100, ((dailyData?.totalDuration || 0) / (16 * 3600)) * 100);

  return (
    <View className="mx-5 mb-4 p-5 bg-zinc-900 rounded-[28px]">
      {/* Status Indicator */}
      <View className="flex-row items-center mb-2">
        <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
        <Text className="text-white font-medium">Balanced</Text>
      </View>

      <View className="flex-row justify-between items-end mb-4">
        <View>
          <Text className="text-white text-4xl font-bold">
            {displayDuration}
          </Text>
          <Text className="text-gray-400 font-medium">Today</Text>
        </View>
        
        {selectedAppId && (
          <TouchableOpacity onPress={onClearAppSelection} className="mb-2 bg-zinc-800 p-2 rounded-full">
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-white font-semibold text-lg mb-3">Daily Screen Time Overview</Text>
      
      {/* Horizontal Daily Bar */}
      <View className="h-10 bg-zinc-800 rounded-full w-full justify-center px-1 overflow-hidden relative">
        {/* Scale Markers (0s, 4h, 8h, 12h, 16h) */}
        <View className="absolute flex-row justify-between w-full px-4 bottom-1 z-10 opacity-50">
          {/* Markers can go here if needed */}
        </View>
        
        {/* The Progress Fill */}
        <View 
          className="h-8 rounded-full bg-green-400" 
          style={{ width: `${progressPercent}%` }} 
        />
      </View>
      <View className="flex-row justify-between mt-1 px-1">
        <Text className="text-gray-500 text-[10px]">0s</Text>
        <Text className="text-gray-500 text-[10px]">4h</Text>
        <Text className="text-gray-500 text-[10px]">8h</Text>
        <Text className="text-gray-500 text-[10px]">12h</Text>
        <Text className="text-gray-500 text-[10px]">16h</Text>
      </View>
    </View>
  );
});

DailyOverview.displayName = 'DailyOverview';
