import React from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useBlocking } from '../context/BlockingContext';
import { AppSelector } from './settings/AppSelector';
import { ScheduleBuilder } from './settings/ScheduleBuilder';

export const Dashboard = () => {
  const {
    isStrict,
    setStrict,
    timeLeft,
    timerState,
    usageLimit,
    setUsageLimit,
    resetTimer,
  } = useBlocking();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView className="flex-1 bg-white pt-12 px-4">
      <Text className="text-3xl font-bold mb-6">ScreenBreak</Text>

      {/* Stat Card */}
      <View className="bg-black rounded-2xl p-6 mb-6">
        <Text className="text-gray-400 text-sm mb-1">Time Saved Today</Text>
        <Text className="text-white text-4xl font-bold">42m</Text>
        <View className="flex-row mt-4">
          <View className="bg-gray-800 px-3 py-1 rounded-full mr-2">
            <Text className="text-white text-xs">12 Breaks</Text>
          </View>
          <View className="bg-gray-800 px-3 py-1 rounded-full">
            <Text className="text-white text-xs">Top: Instagram</Text>
          </View>
        </View>
      </View>

      {/* Status Card */}
      <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
        <Text className="text-gray-500 text-xs font-bold uppercase mb-2">
          Current Status
        </Text>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-medium">
              {timerState === 'USAGE' ? 'Usage Time' : 'Break Time'}
            </Text>
            <Text className="text-gray-500">{formatTime(timeLeft)} remaining</Text>
          </View>
          <View
            className={`w-3 h-3 rounded-full ${
              timerState === 'USAGE' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </View>
        <TouchableOpacity 
            onPress={resetTimer}
            className="mt-3 bg-gray-200 p-2 rounded items-center"
        >
            <Text className="font-medium">Reset Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={() => setUsageLimit(15)} // Fast test mode
            className="mt-3 bg-gray-200 p-2 rounded items-center"
        >
            <Text className="font-medium">Dev: Set 15s Usage</Text>
        </TouchableOpacity>
      </View>

      {/* Strict Mode */}
      <View className="flex-row justify-between items-center py-4 border-b border-gray-100 mb-4">
        <View>
          <Text className="text-lg font-medium">Strict Mode</Text>
          <Text className="text-gray-500 text-sm">
            Prevent unlocking during breaks
          </Text>
        </View>
        <Switch
          value={isStrict}
          onValueChange={setStrict}
          trackColor={{ false: '#e2e2e2', true: '#000' }}
        />
      </View>

      {/* Settings Components */}
      <ScheduleBuilder />
      <AppSelector />
      
      <View className="h-20" /> 
    </ScrollView>
  );
};
