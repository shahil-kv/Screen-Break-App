import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleBlockConfigProps {
    onBack: () => void;
}

export const ScheduleBlockConfig = ({ onBack }: ScheduleBlockConfigProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
      if (days.includes(day)) {
          setDays(days.filter(d => d !== day));
      } else {
          setDays([...days, day]);
      }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-2 flex-row items-center justify-between mb-4">
          <View className="flex-1">
             <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center bg-gray-800 rounded-full">
               <Ionicons name="close" size={24} color="#FFF" />
             </TouchableOpacity>
          </View>
      </View>

      <ScrollView className="flex-1 px-4">
        
        <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-white mb-2">Schedule Block</Text>
            <Text className="text-gray-400 text-center text-sm px-6">
                Choose recurring quiet hours across the week to automatically block selected apps.
            </Text>
        </View>

        {/* Enable Toggle */}
        <View className="bg-gray-800 rounded-2xl p-4 flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
                <Ionicons name="checkmark-circle-outline" size={24} color="#999" style={{ marginRight: 10}} />
                <Text className="text-white font-bold text-lg">Enable Limit</Text>
            </View>
            <Switch 
                value={isEnabled}
                onValueChange={setIsEnabled}
                trackColor={{ false: '#555', true: '#FF007F' }}
                thumbColor={'#FFF'}
            />
        </View>

        {/* Inputs */}
        <View className="bg-gray-800 rounded-2xl mb-6 overflow-hidden">
             <View className="flex-row items-center p-4 border-b border-gray-700">
                <Text className="text-gray-400 text-lg w-8">Aa</Text>
                <Text className="text-white text-lg font-medium flex-1">Name</Text>
                <View className="flex-row items-center">
                    <Ionicons name="ban-outline" size={16} color="red" style={{ marginRight: 4 }} />
                    <Text className="text-gray-400">Schedule Block</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
             </View>
             <TouchableOpacity className="flex-row items-center p-4">
                <Ionicons name="apps-outline" size={20} color="#999" style={{ width: 32 }} />
                <Text className="text-white text-lg font-medium flex-1">Apps Blocked</Text>
                <View className="flex-row items-center">
                    <Text className="text-gray-400 mr-2">0 apps, 0 categories</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
             </TouchableOpacity>
        </View>
        <Text className="text-red-500 text-xs text-center mb-6 -mt-4">At least one app or category must be selected</Text>


        {/* Block Activation Timing */}
        <Text className="text-white font-bold text-lg mb-4">Block Activation Timing</Text>

        <View className="bg-gray-800 rounded-2xl p-4 mb-4">
            <Text className="text-white text-base mb-4">Days When Block is Active</Text>
            <View className="flex-row justify-between">
                {allDays.map(day => (
                    <TouchableOpacity 
                        key={day}
                        onPress={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full items-center justify-center ${days.includes(day) ? 'bg-pink-500' : 'bg-gray-700'}`}
                    >
                        <Text className="text-white text-xs font-bold">{day}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View className="bg-gray-800 rounded-2xl p-4 mb-4">
             <Text className="text-white text-base mb-4">Hours When Block is Active</Text>
             <View className="flex-row justify-between items-center py-2 border-b border-gray-700">
                 <Text className="text-white">From</Text>
                 <View className="bg-gray-700 px-3 py-1 rounded">
                     <Text className="text-white">12:00 AM</Text>
                 </View>
             </View>
             <View className="flex-row justify-between items-center py-2 pt-4">
                 <Text className="text-white">To</Text>
                 <View className="bg-gray-700 px-3 py-1 rounded">
                     <Text className="text-white">11:59 PM</Text>
                 </View>
             </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};
