import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, AppState } from 'react-native';
import { useBlocking } from '../../context/BlockingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenTimeChart } from '../ScreenTimeChart';
import { ScreenTimeService } from '../../services/ScreenTimeService';
import { DailyUsage, AppUsage, MOCK_DATA } from '../../utils/screenTimeData';
import { DatePickerModal } from '../ui/DatePickerModal';
import { PermissionBanner } from '../ui/PermissionBanner';

// Optimized Sub-components
import { DateStrip } from '../home/DateStrip';
import { DailyOverview } from '../home/DailyOverview';
import { AppUsageList } from '../home/AppUsageList';

export const HomeScreen = () => {
  const { isStrict, setStrict, triggerDemoBlock } = useBlocking();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate()); 
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  // Real Data State
  const [dailyData, setDailyData] = useState<DailyUsage | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'short' }));

  // Load Data Effect
  useEffect(() => {
    checkPermissionAndLoadData();

    // Reload when app comes to foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPermissionAndLoadData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [selectedDate]);

  const checkPermissionAndLoadData = async () => {
    console.log('[HomeScreen] Checking permissions...');
    if (Platform.OS === 'android') {
        try {
            const hasPerm = await ScreenTimeService.hasPermission();
            console.log('[HomeScreen] hasPermission result:', hasPerm);
            setHasPermission(hasPerm);
            
            if (hasPerm) {
                console.log('[HomeScreen] Fetching daily usage...');
                const date = new Date();
                date.setDate(selectedDate);
                const data = await ScreenTimeService.getDailyUsage(date.getTime());
                console.log('[HomeScreen] Daily usage fetched:', data ? 'Data found' : 'Null');
                setDailyData(data);
            } else {
                 console.log('[HomeScreen] Permission denied. Loading mock data.');
                 setDailyData(MOCK_DATA[selectedDate] ?? null);
            }
        } catch (error) {
            console.error('[HomeScreen] Error checking permission:', error);
        }
    } else {
        // iOS / Other: Use MOCK
        // Ensure we have data for the default valid date (14) if selectedDate doesn't exist in MOCK
        setDailyData(MOCK_DATA[14]); 
    }
  };

  const handleRequestPermission = () => {
    ScreenTimeService.requestPermission();
    // Re-check after a delay or on app foreground (handled by AppState)
  };
  
  // Calculate displayed apps
  const displayedApps = useMemo(() => {
      if (!dailyData) return [];
      
      // If we are looking at a specific hour, show apps from that hour
      if (selectedHour !== null) {
          if (dailyData.hourly && dailyData.hourly[selectedHour]) {
              return dailyData.hourly[selectedHour].apps;
          }
          return [];
      } 
      
      // If we have pre-aggregated apps (from Native Module), use them
      if (dailyData.apps && dailyData.apps.length > 0) {
          return dailyData.apps;
      }

      // Otherwise, show aggregated daily totals from hourly data (Mock Data fallback)
      const appMap = new Map();
      if (dailyData.hourly) {
          dailyData.hourly.forEach(h => {
              h.apps.forEach(app => {
                  const existing = appMap.get(app.id) || { ...app, duration: 0 };
                  existing.duration += app.duration;
                  appMap.set(app.id, existing);
              });
          });
      }
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
                <TouchableOpacity onPress={checkPermissionAndLoadData}>
                    <Ionicons name="refresh" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Permission Banner */}
        {!hasPermission && Platform.OS === 'android' && (
            <PermissionBanner onPress={handleRequestPermission} />
        )}

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
                dailyData={dailyData ?? undefined}
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
                    dailyData={dailyData ?? undefined}
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

                {/* Separator */}
                <View className="h-[1px] bg-zinc-800 my-4" />

                {/* App List (Nested Inside) */}
                <Text className="text-white text-lg font-bold mb-4">
                    {selectedHour !== null 
                        ? `Apps used at ${selectedHour}:00` 
                        : "Most Used Apps"}
                </Text>
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
