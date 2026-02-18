import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useBlocking } from '../../context/BlockingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTimeChart } from '../ScreenTimeChart';
import { MOCK_DATA, formatDuration } from '../../utils/screenTimeData';

const { width } = Dimensions.get('window');

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DATES = [8, 9, 10, 11, 12, 13, 14];

import { DatePickerModal } from '../ui/DatePickerModal';

// ... imports

export const HomeScreen = () => {
  const { isStrict, setStrict, triggerDemoBlock } = useBlocking();
  const [selectedDate, setSelectedDate] = useState(14); 
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState('Feb');

  const dailyData = MOCK_DATA[selectedDate];
  
  // Calculate displayed apps
  const displayedApps = useMemo(() => {
      if (!dailyData) return [];
      
      // If we are looking at a specific hour, show apps from that hour
      if (selectedHour !== null) {
          let apps = dailyData.hourly[selectedHour].apps;
          return apps;
      } 
      
      // Otherwise, show aggregated daily totals
      const appMap = new Map();
      dailyData.hourly.forEach(h => {
          h.apps.forEach(app => {
              const existing = appMap.get(app.id) || { ...app, duration: 0 };
              existing.duration += app.duration;
              appMap.set(app.id, existing);
          });
      });
      return Array.from(appMap.values()).sort((a, b) => b.duration - a.duration);
  }, [selectedDate, selectedHour, dailyData]);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1">
        
        {/* Header */}
        <View className="px-5 pt-2 pb-4 flex-row justify-between items-center bg-black z-10">
            <Text className="text-white text-xl font-bold">Screen Save</Text>
            <View className="flex-row">
                <TouchableOpacity onPress={() => setStrict(!isStrict)} className="mr-4">
                     <Ionicons name={isStrict ? "shield-checkmark" : "shield-outline"} size={22} color={isStrict ? "#ec4899" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="refresh" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Date Strip */}
        <View className="px-5 py-4 flex-row justify-between items-center bg-black z-10">
             <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="mr-4 active:opacity-70"
             >
                 <Text className="text-white font-bold text-lg">{currentYear}</Text>
                 <View className="flex-row items-center border border-zinc-800 rounded-full px-2 py-1 bg-zinc-900 mt-1">
                    <Text className="text-pink-500 text-sm font-bold mr-1">{currentMonth}</Text>
                    <Ionicons name="chevron-down" size={12} color="#ec4899" />
                 </View>
             </TouchableOpacity>

             <View className="flex-1 flex-row justify-between">
                {DAYS.map((day, index) => {
// ...
                    const date = DATES[index];
                    const isSelected = date === selectedDate;
                    return (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => { 
                                setSelectedDate(date); 
                                setSelectedHour(null); 
                                setSelectedAppId(null); 
                            }}
                            className={`items-center justify-center w-8 h-12 rounded-xl ${isSelected ? 'bg-pink-500' : 'bg-transparent'}`}
                        >
                            <Text className={`text-xs mb-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>{day}</Text>
                            <Text className={`text-base font-bold ${isSelected ? 'text-white' : 'text-white'}`}>{date}</Text>
                        </TouchableOpacity>
                    );
                })}
             </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Daily Overview Card */}
            <View className="mx-5 mb-4 p-5 bg-zinc-900 rounded-[28px]">
                {/* Status Indicator */}
                <View className="flex-row items-center mb-2">
                    <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    <Text className="text-white font-medium">Balanced</Text>
                </View>

                <View className="flex-row justify-between items-end mb-4">
                     <View>
                        <Text className="text-white text-4xl font-bold">
                            {/* If selected app, we need its total duration for the day */}
                            {selectedAppId ? formatDuration(
                                dailyData?.hourly.reduce((acc, h) => {
                                    const app = h.apps.find(a => a.id === selectedAppId);
                                    return acc + (app ? app.duration : 0);
                                }, 0) || 0
                            ) : (dailyData ? formatDuration(dailyData.totalDuration) : "0m")}
                        </Text>
                        <Text className="text-gray-400 font-medium">Today</Text>
                     </View>
                     
                     {selectedAppId && (
                        <TouchableOpacity onPress={() => setSelectedAppId(null)} className="mb-2 bg-zinc-800 p-2 rounded-full">
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                     )}
                </View>

                <Text className="text-white font-semibold text-lg mb-3">Daily Screen Time Overview</Text>
                
                {/* Horizontal Daily Bar */}
                <View className="h-10 bg-zinc-800 rounded-full w-full justify-center px-1 overflow-hidden relative">
                     {/* Scale Markers (0s, 4h, 8h, 12h, 16h) */}
                     <View className="absolute flex-row justify-between w-full px-4 bottom-1 z-10 opacity-50">
                        {/* We handle labels below the bar usually, but let's try inside or just simple bar first like screenshot */}
                     </View>
                     
                     {/* The Progress Fill */}
                     <View 
                        className="h-8 rounded-full bg-green-400" 
                        style={{ width: `${Math.min(100, ((dailyData?.totalDuration || 0) / (16 * 3600)) * 100)}%` }} // Scale to 16h target
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

            {/* Chart Card */}
            <View className="mx-5 mb-6 p-5 bg-zinc-900 rounded-[28px]">
                <Text className="text-white font-semibold text-lg mb-4">Hourly Screen Time Breakdown</Text>
                
                <ScreenTimeChart 
                    selectedDate={selectedDate} 
                    selectedHour={selectedHour} 
                    selectedAppId={selectedAppId}
                    onSelectHour={setSelectedHour} 
                />

                {/* Filter Chip */}
                {selectedHour !== null && (
                    <View className="flex-row justify-between items-center mt-4 mb-4 p-3 bg-zinc-800 rounded-xl">
                        <Text className="text-white font-bold">
                            {selectedHour}:00 - {selectedHour + 1}:00
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setSelectedHour(null)}
                        >
                            <Ionicons name="close-circle" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Separator if needed, or just space */}
                <View className="h-[1px] bg-zinc-800 my-4" />

                {/* App List (Nested Inside) */}
                <View className="mt-2">
                    {displayedApps.map((app, index) => {
                        const isSelected = selectedAppId === app.id;
                        const appColor = app.color || "#ffffff"; 

                        return (
                            <TouchableOpacity 
                                key={`${app.id}-${index}`} 
                                onPress={() => {
                                    if (isStrict) {
                                        triggerDemoBlock();
                                    } else {
                                        // Toggle selection
                                        setSelectedAppId(isSelected ? null : app.id);
                                    }
                                }}
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
                    })}
                    {displayedApps.length === 0 && (
                        <Text className="text-gray-500 text-center mt-4">No activity recorded</Text>
                    )}
                </View>
            </View>
        </ScrollView>

        <DatePickerModal 
            visible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            selectedYear={currentYear}
            selectedMonth={currentMonth}
            onSelect={(y, m) => {
                setCurrentYear(y);
                setCurrentMonth(m);
                setShowDatePicker(false);
            }}
        />

      </View>
    </SafeAreaView>
  );
};
