import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, AppState, RefreshControl } from 'react-native';
import { useBlocking } from '../../context/BlockingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
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
  const isFocused = useIsFocused(); // Check if screen is active
  
  const refreshCount = useRef(0); // Track auto-refreshes

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

    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

  // Load Data Effect & Auto-Refresh
  useEffect(() => {
    // Initial Load (always run on mount/date change)
    checkPermissionAndLoadData(false);

    // Auto-Refresh every 60 seconds (Silent) - ONLY if Focused
    let intervalId: NodeJS.Timeout;

    if (isFocused) {
        
        intervalId = setInterval(() => {
            if (AppState.currentState === 'active') {
                refreshCount.current += 1;
                checkPermissionAndLoadData(true); // Silent refresh
            }
        }, 60 * 1000);
    }

    // Reload when app comes to foreground (and screen is focused)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isFocused) {
        refreshCount.current += 1;
        checkPermissionAndLoadData(true); // Silent refresh on foreground
      }
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      subscription.remove();
    };
  }, [selectedDate, isFocused]); // Re-run when focus changes

  const checkPermissionAndLoadData = async (silent = false) => {
    if (!silent) setIsLoading(true); // Only show full loader if not silent

    if (Platform.OS === 'android') {
        try {
            const hasPerm = await ScreenTimeService.hasPermission();
            setHasPermission(hasPerm);
            
            if (hasPerm) {
                const date = new Date();
                date.setDate(selectedDate);
                const data = await ScreenTimeService.getDailyUsage(date.getTime());
                setDailyData(data);
            } else {
                 setDailyData(MOCK_DATA[selectedDate] ?? null);
            }
        } catch (error) {
            console.error('[HomeScreen] Error checking permission:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    } else {
        setDailyData(MOCK_DATA[14]); 
        setIsLoading(false);
        setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkPermissionAndLoadData(true); // specific pull-to-refresh state handles spinner
  }, []);

  // ... (handlers remain the same) ...
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

  const handleAppPress = useCallback((appId: string) => {
    if (isStrict) {
        triggerDemoBlock();
    } else {
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

  // Determine color of selected hour bar for "theme" inheritance
  const selectedBarColor = useMemo(() => {
      if (selectedHour === null || !dailyData) return undefined;
      
      const hourData = dailyData.hourly.find(h => h.hour === selectedHour);
      if (!hourData) return undefined;

      const duration = hourData.totalDuration;
      const minutes = duration / 60;
      
      // Dynamic color logic matching chart
      if (minutes < 20) return "#4ade80"; // Green
      else if (minutes < 45) return "#facc15"; // Yellow
      return "#f87171"; // Red
  }, [selectedHour, dailyData]);

  if (isLoading && !dailyData) {
      return (
        <SafeAreaView className="flex-1 bg-black items-center justify-center">
             <View className="items-center">
                 {/* Simple Loading Animation / Icon */}
                 <View className="flex-row mb-6">
                     <Ionicons name="hourglass-outline" size={48} color="gray" style={{ opacity: 0.8 }} />
                 </View>
                 <Text className="text-white text-lg font-medium mb-2">Analyzing Screen Time...</Text>
                 <Text className="text-gray-400 text-sm text-center px-10">This may take a few seconds.</Text>
                 
                 <TouchableOpacity onPress={() => checkPermissionAndLoadData(false)} className="mt-8 bg-zinc-800 px-6 py-3 rounded-full">
                     <Text className="text-white font-bold">Refresh</Text>
                 </TouchableOpacity>
             </View>
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="flex-1">
        
        {/* Header */}
        <View className="px-5 pt-2 pb-4 flex-row justify-between items-center bg-black z-10">
            <Text className="text-white text-xl font-bold">Screen Save</Text>
            <View className="flex-row">
                <TouchableOpacity onPress={() => checkPermissionAndLoadData(false)}>
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

        <ScrollView 
            className="flex-1" 
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" title="Pull to refresh" titleColor="#fff" />
            }
        >
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

                {selectedHour !== null && (
                    <View className="flex-row items-center justify-between mt-4">
                        <View className="flex-row items-center bg-[#ec4899] px-4 py-2 rounded-full">
                            <Text className="text-white font-bold text-sm mr-2">
                                {selectedHour === 0 ? '12 AM' : selectedHour < 12 ? `${selectedHour} AM` : selectedHour === 12 ? '12 PM' : `${selectedHour - 12} PM`}
                                {' - '}
                                {selectedHour + 1 === 24 ? '12 AM' : selectedHour + 1 < 12 ? `${selectedHour + 1} AM` : selectedHour + 1 === 12 ? '12 PM' : `${selectedHour + 1 - 12} PM`}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectedHour(null)}>
                                <Ionicons name="close-circle" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
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
                    overrideColor={selectedBarColor}
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
