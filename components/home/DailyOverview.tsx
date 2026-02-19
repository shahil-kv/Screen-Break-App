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

  /* 
   Dynamic Status Logic:
   < 4h -> Balanced (Green)
   4h - 6h -> Caution (Yellow)
   > 6h -> Severe (Red)
  */
  const totalSeconds = dailyData?.totalDuration || 0;
  const totalHours = totalSeconds / 3600;

  let statusText = "Balanced";
  let statusColor = "bg-green-500";
  let barColor = "bg-green-400";

  if (totalHours >= 6) {
      statusText = "Severe";
      statusColor = "bg-red-500";
      barColor = "bg-red-500";
  } else if (totalHours >= 4) {
      statusText = "Caution";
      statusColor = "bg-yellow-500";
      barColor = "bg-yellow-400";
  }

  const progressPercent = Math.min(100, (totalSeconds / (16 * 3600)) * 100);

  return (
    <View className="mx-5 mb-4 p-5 bg-zinc-900 rounded-[28px]">
      {/* Status Header */}
      <View className="flex-row items-center mb-6">
        <View className={`w-3 h-3 rounded-full ${statusColor} mr-2`} />
        <Text className="text-white font-medium text-base">{statusText}</Text>
      </View>

      {/* Stats Row */}
      <View className="flex-row items-start">
          {/* Screen Time Column */}
          <View className="mr-10">
              <Text className="text-zinc-500 font-bold text-xs tracking-widest mb-1">SCREEN TIME</Text>
              <Text className="text-white text-4xl font-bold">
                {displayDuration}
              </Text>
          </View>

          {/* Pickups Column */}
          <View>
              <Text className="text-zinc-500 font-bold text-xs tracking-widest mb-1">PICKUPS</Text>
              <Text className="text-white text-4xl font-bold">
                {dailyData?.pickups || 0}
              </Text>
          </View>
      </View>

      {/* Horizontal Daily Bar */}
      <View className="h-10 bg-zinc-800 rounded-full w-full justify-center px-1 overflow-hidden relative mt-6">
        <View 
          className={`h-8 rounded-full ${barColor}`} 
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

      {selectedAppId && (
        <TouchableOpacity onPress={onClearAppSelection} className="absolute top-5 right-5 bg-zinc-800 p-2 rounded-full">
            <Ionicons name="close" size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
});

DailyOverview.displayName = 'DailyOverview';
