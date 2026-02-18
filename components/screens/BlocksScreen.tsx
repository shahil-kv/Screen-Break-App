import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlocking } from '../../context/BlockingContext';
import { LaunchLimitConfig } from '../blocks/LaunchLimitConfig';
import { UsageBudgetConfig } from '../blocks/UsageBudgetConfig';
import { ScheduleBlockConfig } from '../blocks/ScheduleBlockConfig';
import { RuleCreationModal } from '../blocks/RuleCreationModal';

export const BlocksScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeConfig, setActiveConfig] = useState<string | null>(null);

  const handleSelectRule = (ruleId: string) => {
    setActiveConfig(ruleId);
  };

  if (activeConfig === 'schedule') {
      return <ScheduleBlockConfig onBack={() => setActiveConfig(null)} />;
  }

  if (activeConfig === 'launch') {
      return <LaunchLimitConfig onBack={() => setActiveConfig(null)} />;
  }

  if (activeConfig === 'usage') {
      return <UsageBudgetConfig onBack={() => setActiveConfig(null)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mt-6 mb-8">
          <Text className="text-4xl font-bold text-white">Blocks</Text>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center mt-20">
            {/* Simple CSS shape/icon for empty state */}
            <View className="flex-row space-x-4 mb-6 opacity-50">
                <View className="w-16 h-16 rounded-full bg-gray-800" />
                <View className="w-16 h-16 rounded-full bg-gray-800" />
            </View>
            <View className="w-12 h-1 bg-gray-700 rounded-full mb-8" />
            
            <Text className="text-gray-500 text-lg text-center mb-2">
                No active block rules
            </Text>
            <Text className="text-gray-600 text-center px-10">
                Create a rule to start taking control of your screen time.
            </Text>
        </View>

      </ScrollView>

      {/* Floating Action Button for Add Rule */}
      <View className="absolute bottom-36 w-full px-4">
          <TouchableOpacity 
            className="bg-pink-500 h-14 rounded-full flex-row items-center justify-center shadow-lg"
            activeOpacity={0.8}
            onPress={() => setIsModalVisible(true)}
          >
              <Text className="text-white text-lg font-bold mr-2">+</Text>
              <Text className="text-white text-lg font-bold">Add Block Rule</Text>
          </TouchableOpacity>
      </View>

      <RuleCreationModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectRule={handleSelectRule}
      />
    </SafeAreaView>
  );
};
