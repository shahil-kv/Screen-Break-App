import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <View className="flex-1 items-center justify-between py-10 px-6">
       <View /> 

      <View className="items-center w-full">
        {/* Logo / Icon */}
        <View className="w-20 h-20 bg-pink-500 rounded-3xl items-center justify-center shadow-lg shadow-pink-500/30 rotate-12 mb-10">
            <Ionicons name="hourglass-outline" size={40} color="white" />
        </View>

        <View className="items-center px-4">
            <Text className="text-lg mb-4 font-bold text-center text-gray-500" style={{ fontFamily: 'Outfit_700Bold' }}>
            Welcome to ScreenBreak
            </Text>
            
            <Text className="text-4xl text-center text-white leading-tight" style={{ fontFamily: 'Outfit_400Regular' }}>
            Take Control of Your Screen Time
            </Text>
        </View>

      </View>

      <View className="w-full">
        <TouchableOpacity 
            onPress={onNext}
            className="w-full rounded-full bg-white py-5 items-center shadow-lg active:scale-95 transition-transform"
        >
            <Text className="text-black text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                Get Started
            </Text>
        </TouchableOpacity>
        
        <Text className="text-left text-xs text-gray-500 mt-6 px-4">
            By tapping Get Started, you agree to our <Text className='text-blue-500'>Privacy Policy</Text> and <Text className='text-blue-500'>Terms and Conditions</Text>.
        </Text>
      </View>
    </View>
  );
};
