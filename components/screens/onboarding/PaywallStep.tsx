import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface PaywallStepProps {
  onNext: () => void;
}

export const PaywallStep: React.FC<PaywallStepProps> = ({ onNext }) => {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const { height } = Dimensions.get('window');

  const timelineItems = [
    {
      icon: <Ionicons name="checkmark-circle" size={24} color="#bbe73c" />,
      title: "Get your Focus Diagnosis",
      description: "Kickstart your journey to better focus.",
      isCompleted: true
    },
    {
      icon: <Ionicons name="lock-closed" size={20} color="white" />,
      title: "Today: Improve Your Focus",
      description: "Start blocking distractions, track your screen time, and build better habits.",
      isLocked: true
    },
    {
      icon: <Ionicons name="notifications" size={20} color="white" />,
      title: "Day 6: See the Difference",
      description: "We'll send you a personalized report to showcase your progress.",
      isLocked: true
    },
    {
      icon: <Ionicons name="star" size={20} color="white" />,
      title: "Day 7: Trial Ends",
      isLocked: true
    }
  ];

  return (
    <View className="flex-1 bg-black px-6">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="py-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-400 text-lg font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Restore</Text>
            <TouchableOpacity className="bg-gray-800 rounded-full p-2">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-3xl font-bold text-center text-white mb-10 leading-10" style={{ fontFamily: 'Outfit_700Bold' }}>
            Start Your Free Trial and Take Back 2+ Hours of Your Day
          </Text>

          {/* Timeline */}
          <View className="px-4 mb-10">
            {timelineItems.map((item, index) => (
              <View key={index} className="flex-row items-start mb-8 relative">
                {/* Vertical Line */}
                {index < timelineItems.length - 1 && (
                  <View 
                    className="absolute left-[15px] top-[30px] w-[2px] bg-gray-800"
                    style={{ 
                        height: 50,
                        backgroundColor: item.isCompleted ? '#bbe73c' : '#333'
                    }}
                  />
                )}
                
                <View 
                  className={`w-8 h-8 rounded-full items-center justify-center z-10 ${item.isCompleted ? 'bg-transparent' : 'bg-gray-800'}`}
                >
                  {item.icon}
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-white text-lg font-bold mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Outfit_400Regular' }}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Plan Options */}
          <View className="space-y-4 mb-6">
            {/* Yearly Plan */}
            <TouchableOpacity 
              onPress={() => setSelectedPlan('yearly')}
              className={`p-6 rounded-3xl border-2 relative ${selectedPlan === 'yearly' ? 'border-white bg-[#1c1c1e]' : 'border-transparent bg-gray-900'}`}
            >
              <View className="absolute -top-4 -right-2 bg-white px-3 py-1 rounded-full shadow-sm">
                <Text className="text-black text-xs font-bold">₹ 124.92/month</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>12 Months</Text>
                  <Text className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Outfit_400Regular' }}>7-day free trial</Text>
                </View>
                <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>₹ 1,499/year</Text>
              </View>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity 
              onPress={() => setSelectedPlan('monthly')}
              className={`p-6 rounded-3xl border-2 ${selectedPlan === 'monthly' ? 'border-white bg-[#1c1c1e]' : 'border-transparent bg-gray-900'}`}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>Monthly</Text>
                  <Text className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Outfit_400Regular' }}>Renews monthly</Text>
                </View>
                <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>₹ 299/month</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="pb-8 pt-4">
        <TouchableOpacity
          onPress={onNext}
          className="w-full rounded-full bg-[#ff006e] py-5 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
        >
          <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
            Continue
          </Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-[10px] text-center mt-4 px-4 line-clamp-2" style={{ fontFamily: 'Outfit_400Regular' }}>
          7-day free trial, then ₹ 1,499/year. Auto-renews until canceled.
        </Text>
      </View>
    </View>
  );
};
