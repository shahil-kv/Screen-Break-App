import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <View className="flex-1 items-center justify-between py-12 px-6">
       <View /> 

      <View className="items-center w-full space-y-8">
        {/* Logo / Icon */}
        <View className="w-24 h-24 bg-pink-500 rounded-3xl items-center justify-center shadow-lg shadow-pink-500/30 rotate-12 mb-8">
            <Ionicons name="hourglass-outline" size={48} color="white" />
        </View>

        <View className="items-center space-y-8">
            <Text className="text-xl mb-6 font-bold text-center text-gray-600" style={{ fontFamily: 'Outfit_700Bold' }}>
            Welcome to ScreenBreak
            </Text>
            
            <Text className=" text-5xl text-center  text-white leading-tight px-4" style={{ fontFamily: 'Outfit_400Regular' }}>
            Take Control of Your Screen Time
            </Text>
        </View>

      </View>

      <View className="w-full space-y-4">
        <TouchableOpacity 
            onPress={onNext}
            className="w-full rounded-full bg-white  py-5  items-center shadow-lg"
        >
            <Text className="text-black text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                Get Started
            </Text>
        </TouchableOpacity>
        
        <Text className="text-left text-sm text-gray-400 px-4  mt-5">
            By tapping Get Started, you agree to our <Text className='text-blue-500'>Privacy Policy</Text>  and <Text className='text-blue-500'>Terms and Conditions</Text>.
        </Text>
      </View>
    </View>
  );
};
