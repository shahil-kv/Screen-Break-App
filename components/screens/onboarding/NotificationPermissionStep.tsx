import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

interface NotificationPermissionStepProps {
  onNext: () => void;
}

export const NotificationPermissionStep: React.FC<NotificationPermissionStepProps> = ({ onNext }) => {
  const { width } = Dimensions.get('window');

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    // Proceed regardless of status for now, as per user's request "Give that permission also then it will working this is the final step"
    onNext();
  };

  return (
    <View className="flex-1 bg-black px-6 pt-10">
      <View className="items-center w-full mb-8">
        {/* Animated Eyes/Circles Illustration */}
        <View className="flex-row space-x-12 mb-10">
          <View className="w-24 h-14 bg-gray-600 rounded-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-full" />
          </View>
          <View className="w-24 h-14 bg-gray-600 rounded-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-full" />
          </View>
        </View>

        <Text className="text-4xl font-bold text-center text-white mb-4 px-2" style={{ fontFamily: 'Outfit_700Bold' }}>
          Notification Required
        </Text>
        
        <Text className="text-lg text-center text-gray-500 leading-6 px-4" style={{ fontFamily: 'Outfit_400Regular' }}>
          ScreenBreak requires notifications to unlock blocked apps. We'll never send you ads.
        </Text>
      </View>

      {/* Mockup Phone Illustration */}
      <View className="flex-1 items-center justify-center -mt-10 mb-10">
        <View 
            className="w-[280px] h-[500px] bg-[#1c1c1e] rounded-[50px] border-[8px] border-gray-800 relative overflow-hidden items-center pt-20"
            style={{ 
                shadowColor: '#fff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 20
            }}
        >
          {/* Mock Notification */}
          <View className="w-[240px] bg-[#2c2c2e] rounded-2xl p-4 flex-row items-center space-x-3 mb-10">
             <View className="w-10 h-10 bg-white rounded-lg items-center justify-center">
                 <View className="flex-row space-x-1">
                    <View className="w-2 h-1 bg-black rounded-full" />
                    <View className="w-2 h-1 bg-black rounded-full" />
                 </View>
             </View>
             <View>
                 <Text className="text-white font-bold text-sm">Take a challenge</Text>
                 <Text className="text-gray-400 text-xs">to unlock the app</Text>
             </View>
          </View>

          {/* I am watching you section */}
          <View className="items-center mt-10">
            <View className="flex-row space-x-4 mb-6">
                <View className="w-10 h-6 bg-gray-600 rounded-full overflow-hidden relative">
                    <View className="absolute inset-x-1 top-1 bottom-0 bg-black rounded-full" />
                </View>
                <View className="w-10 h-6 bg-gray-600 rounded-full overflow-hidden relative">
                    <View className="absolute inset-x-1 top-1 bottom-0 bg-black rounded-full" />
                </View>
            </View>

            <Text className="text-white text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
                I am watching you
            </Text>
            
            <Text className="text-gray-400 text-center text-sm px-6" style={{ fontFamily: 'Outfit_400Regular' }}>
                This app is blocked by ScreenBreak. To access it, you must take a focus challenge.
            </Text>
          </View>

          {/* Home Indicator */}
          <View className="absolute bottom-4 w-24 h-1.5 bg-gray-700 rounded-full" />
        </View>
      </View>

      <View className="pb-8">
        <TouchableOpacity
          onPress={requestNotificationPermission}
          className="w-full rounded-full bg-[#ff006e] py-5 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
        >
          <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
            Give Permission
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
