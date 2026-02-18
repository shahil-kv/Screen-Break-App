import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface LaunchLimitConfigProps {
    onBack: () => void;
}

export const LaunchLimitConfig = ({ onBack }: LaunchLimitConfigProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [periodType, setPeriodType] = useState<'Daily' | 'Hourly'>('Daily');
  const [limitCount, setLimitCount] = useState(5);

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
            <Text className="text-3xl font-bold text-white mb-2">App Launch Limit</Text>
            <Text className="text-gray-400 text-center text-sm px-4">
                Set how many times the selected apps can launch before a Focus Challenge is required.
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
                    <Text className="text-gray-400">App Launch Limit</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
             </View>
             <TouchableOpacity className="flex-row items-center p-4">
                <Ionicons name="apps-outline" size={20} color="#999" style={{ width: 32 }} />
                <Text className="text-white text-lg font-medium flex-1">Apps Limited</Text>
                <View className="flex-row items-center">
                    <Text className="text-gray-400 mr-2">0 apps, 0 categories</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
             </TouchableOpacity>
        </View>

        {/* Limit Period */}
        <Text className="text-white font-bold text-lg mb-4">Limit Period</Text>
        <View className="bg-gray-800 rounded-2xl p-4 mb-6 flex-row justify-between items-center">
             <Text className="text-white text-base">Period Type</Text>
             <View className="bg-gray-700 rounded-lg p-1 flex-row">
                 <TouchableOpacity 
                    onPress={() => setPeriodType('Daily')}
                    className={`px-4 py-1.5 rounded-md ${periodType === 'Daily' ? 'bg-gray-500' : 'bg-transparent'}`}
                 >
                     <Text className="text-white text-xs font-bold">Daily</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                    onPress={() => setPeriodType('Hourly')}
                    className={`px-4 py-1.5 rounded-md ${periodType === 'Hourly' ? 'bg-gray-500' : 'bg-transparent'}`}
                 >
                     <Text className="text-white text-xs font-bold">Hourly</Text>
                 </TouchableOpacity>
             </View>
        </View>

        {/* Daily Launch Limit */}
        <Text className="text-white font-bold text-lg mb-4">Daily Launch Limit</Text>
        <View className="bg-gray-800 rounded-2xl p-4 mb-4 flex-row justify-between items-center">
             <View className="flex-1 pr-4">
                <Text className="text-white text-base font-bold">Unlocks Without Challenges</Text>
             </View>
             <View className="flex-row items-center space-x-4 bg-gray-700 rounded-lg p-1">
                 <TouchableOpacity 
                    onPress={() => setLimitCount(Math.max(1, limitCount - 1))}
                    className="w-8 h-8 items-center justify-center bg-gray-600 rounded"
                 >
                     <Ionicons name="remove" size={20} color="#FFF" />
                 </TouchableOpacity>
                 <Text className="text-white text-xl font-bold w-6 text-center">{limitCount}</Text>
                 <TouchableOpacity 
                    onPress={() => setLimitCount(limitCount + 1)}
                    className="w-8 h-8 items-center justify-center bg-gray-600 rounded"
                 >
                     <Ionicons name="add" size={20} color="#FFF" />
                 </TouchableOpacity>
             </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};
