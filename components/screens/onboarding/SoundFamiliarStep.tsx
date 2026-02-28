import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SoundFamiliarStepProps {
  onNext: () => void;
}

export const SoundFamiliarStep: React.FC<SoundFamiliarStepProps> = ({ onNext }) => {
  return (
    <View className="flex-1 items-center justify-between py-6 px-6">
        <View className="w-full items-center flex-1">
            {/* Top Icon */}
            <View className="mt-4 mb-2">
                <View className="flex-row space-x-4">
                        <View className="w-16 h-10 bg-gray-700 rounded-full p-1 justify-center items-end rotate-12">
                            <View className="w-8 h-8 bg-gray-400 rounded-full" />
                        </View>
                        <View className="w-16 h-10 bg-gray-700 rounded-full p-1 justify-center items-end -rotate-12">
                            <View className="w-8 h-8 bg-gray-400 rounded-full" />
                        </View>
                </View>
            </View>

            <View className="items-center mb-6 mt-10">
                <Text className="text-4xl font-bold text-center text-white mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>
                    Sound familiar?
                </Text>
                <Text className="text-lg text-center text-gray-400" style={{ fontFamily: 'Outfit_400Regular' }}>
                    Tap what resonates with you
                </Text>
            </View>

            <View className="w-full flex-1">
                {[
                    "A. \"Just a quick check\" turned into an hour-long scroll",
                    "B. Checked the time, now it's way past bedtime",
                    "C. Battery at 20%, but couldn't put it down",
                    "D. One article led to a whole afternoon of reading"
                ].map((text, index) => (
                    <TouchableOpacity key={index} className="w-full bg-[#1A1A1D] p-4 rounded-2xl mb-3">
                        <Text className="text-white/70 text-lg" style={{ fontFamily: 'Outfit_400Regular' }}>{text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

         <View className="w-full mt-4">
            <TouchableOpacity 
                onPress={onNext}
                className="w-full bg-white py-4 rounded-full items-center shadow-lg active:scale-95 transition-transform"
            >
                <Text className="text-black text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                    It's me
                </Text>
            </TouchableOpacity>
        </View>

    </View>
  );
};
