import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface UsageBudgetConfigProps {
    onBack: () => void;
}

export const UsageBudgetConfig = ({ onBack }: UsageBudgetConfigProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [mode, setMode] = useState<'Separate' | 'Combined'>('Combined');
  const [limitHours, setLimitHours] = useState(1);
  const [limitMinutes, setLimitMinutes] = useState(0);

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
            <Text className="text-3xl font-bold text-white mb-2">Usage Budget</Text>
            <Text className="text-gray-400 text-center text-sm px-4">
                Block apps after reaching a daily or hourly time limit.
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
                    <Text className="text-gray-400">Usage Budget</Text>
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

        {/* Usage Counting Logic */}
        <Text className="text-white font-bold text-lg mb-4">Usage Counting Logic</Text>
        <View className="bg-gray-800 rounded-2xl p-4 mb-6 flex-row justify-between items-center">
             <Text className="text-white text-base">Mode</Text>
             <View className="bg-gray-700 rounded-lg p-1 flex-row">
                 <TouchableOpacity 
                    onPress={() => setMode('Separate')}
                    className={`px-4 py-1.5 rounded-md ${mode === 'Separate' ? 'bg-gray-500' : 'bg-transparent'}`}
                 >
                     <Text className="text-white text-xs font-bold">Separate</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                    onPress={() => setMode('Combined')}
                    className={`px-4 py-1.5 rounded-md ${mode === 'Combined' ? 'bg-gray-500' : 'bg-transparent'}`}
                 >
                     <Text className="text-white text-xs font-bold">Combined</Text>
                 </TouchableOpacity>
             </View>
        </View>

        {/* Budget Configuration */}
        <Text className="text-white font-bold text-lg mb-4">Budget Configuration</Text>
        <View className="bg-gray-800 rounded-2xl p-4 mb-4">
             <Text className="text-white text-base mb-4">Set Time Limit</Text>
             <View className="flex-row justify-center items-center space-x-4">
                 <View className="items-center">
                    <View className="bg-gray-900 rounded-lg p-3 w-16 items-center">
                        <Text className="text-white text-2xl font-bold">{limitHours}</Text>
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">Hours</Text>
                 </View>
                 <Text className="text-white text-xl font-bold">:</Text>
                 <View className="items-center">
                    <View className="bg-gray-900 rounded-lg p-3 w-16 items-center">
                         <Text className="text-white text-2xl font-bold">{limitMinutes.toString().padStart(2, '0')}</Text>
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">Minutes</Text>
                 </View>
             </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};
