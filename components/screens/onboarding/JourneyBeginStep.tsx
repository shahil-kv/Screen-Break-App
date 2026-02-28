import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

interface JourneyBeginStepProps {
  onFinish: () => void;
}

export const JourneyBeginStep: React.FC<JourneyBeginStepProps> = ({ onFinish }) => {
  const { width } = Dimensions.get('window');

  return (
    <View className="flex-1 bg-black px-6 pt-10 justify-center items-center">
      <View className="items-center w-full mb-12">
        {/* Eyes/Circles Illustration */}
        <View className="flex-row space-x-12 mb-16">
          <View className="w-28 h-18 bg-gray-600 rounded-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-white rounded-full" />
            <View className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-600" />
          </View>
          <View className="w-28 h-18 bg-gray-600 rounded-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-white rounded-full" />
            <View className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-600" />
          </View>
        </View>

        <Text className="text-5xl font-bold text-center text-white mb-6 px-2" style={{ fontFamily: 'Outfit_700Bold' }}>
          Your Journey begins now!
        </Text>
        
        <Text className="text-xl text-center text-gray-500 leading-8 px-8" style={{ fontFamily: 'Outfit_400Regular' }}>
          Now let's set up your first blocking rule.
        </Text>
      </View>

      <View className="w-full absolute bottom-12 px-6">
        <TouchableOpacity
          onPress={onFinish}
          className="w-full rounded-full bg-[#ff006e] py-6 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
        >
          <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
            Let's go!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
