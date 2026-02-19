import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useBlocking } from '../../context/BlockingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTimeChart } from '../ScreenTimeChart';
import { MOCK_DATA, AppUsage } from '../../utils/screenTimeData';
import { DatePickerModal } from '../ui/DatePickerModal';

// Optimized Sub-components
import { DateStrip } from '../home/DateStrip';
import { DailyOverview } from '../home/DailyOverview';
import { AppUsageList } from '../home/AppUsageList';

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
      return Array.from(appMap.values()).sort((a, b) => b.duration - a.duration) as AppUsage[];
  }, [selectedDate, selectedHour, dailyData]);

  // Callbacks to prevent re-renders
  const handleSelectDate = useCallback((date: number) => {
    setSelectedDate(date);
    setSelectedHour(null);
    setSelectedAppId(null);
  }, []);

  const handleOpenDatePicker = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleClearAppSelection = useCallback(() => {
    setSelectedAppId(null);
  }, []);

  // Memoized App Press Handler
  const handleAppPress = useCallback((appId: string) => {
    if (isStrict) {
        triggerDemoBlock();
    } else {
        // Toggle selection
        setSelectedAppId(prev => prev === appId ? null : appId);
    }
  }, [isStrict, triggerDemoBlock]);

  const handleDatePickerSelect = useCallback((y: number, m: string) => {
      setCurrentYear(y);
      setCurrentMonth(m);
      setShowDatePicker(false);
  }, []);

  const handleDatePickerClose = useCallback(() => {
      setShowDatePicker(false);
  }, []);
  
  const handleToggleStrict = useCallback(() => {
      setStrict(!isStrict);
  }, [isStrict, setStrict]);

  const selectedAppDuration = useMemo(() => {
      if (!selectedAppId || !dailyData) return 0;
      return dailyData.hourly.reduce((acc, h) => {
          const app = h.apps.find(a => a.id === selectedAppId);
          return acc + (app ? app.duration : 0);
      }, 0);
  }, [selectedAppId, dailyData]);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1">
        
        {/* Header */}
        <View className="px-5 pt-2 pb-4 flex-row justify-between items-center bg-black z-10">
            <Text className="text-white text-xl font-bold">Screen Save</Text>
            <View className="flex-row">
                <TouchableOpacity onPress={handleToggleStrict} className="mr-4">
                     <Ionicons name={isStrict ? "shield-checkmark" : "shield-outline"} size={22} color={isStrict ? "#ec4899" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="refresh" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Date Strip */}
        <DateStrip 
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onOpenDatePicker={handleOpenDatePicker}
        />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Daily Overview Card */}
            <DailyOverview 
                dailyData={dailyData}
                selectedAppId={selectedAppId}
                selectedAppDuration={selectedAppDuration}
                onClearAppSelection={handleClearAppSelection}
            />

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
                <AppUsageList 
                    apps={displayedApps}
                    selectedAppId={selectedAppId}
                    onAppPress={handleAppPress}
                />
            </View>
        </ScrollView>

        <DatePickerModal 
            visible={showDatePicker}
            onClose={handleDatePickerClose}
            selectedYear={currentYear}
            selectedMonth={currentMonth}
            onSelect={handleDatePickerSelect}
        />

      </View>
    </SafeAreaView>
  );
};
