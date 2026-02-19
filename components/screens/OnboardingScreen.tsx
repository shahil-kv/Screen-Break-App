import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  // Temporary total steps until we define all 5-6
  const TOTAL_STEPS = 2; 

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Logic for final step (commented out for now to keep testing loop as requested)
      // await AsyncStorage.setItem('hasLaunched', 'true');
      // navigation.replace('Main');
      
      // For now, just reset to 0 or do nothing so user can see flow again on reload
      console.log("End of current onboarding flow");
    }
  };

  const renderWelcomeStep = () => (
    <View className="flex-1 items-center justify-between py-12 px-6">
       <View /> 

      <View className="items-center w-full space-y-8">
        {/* Logo / Icon */}
        <View className="w-24 h-24 bg-pink-500 rounded-3xl items-center justify-center shadow-lg shadow-pink-500/30 rotate-12 mb-8">
            <Ionicons name="hourglass-outline" size={48} color="white" />
        </View>

        <View className="items-center space-y-4">
            <Text className="text-4xl font-bold text-center text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
            Welcome to ScreenBreak
            </Text>
            
            <Text className="text-xl text-center text-gray-400 leading-relaxed px-4" style={{ fontFamily: 'Outfit_400Regular' }}>
            Take Control of Your Screen Time
            </Text>
        </View>

        {/* Visual Element */}
        <View className="flex-row space-x-8 mt-8">
            <View className="items-center space-y-2">
                <View className="w-16 h-8 bg-gray-800 rounded-full p-1 justify-center items-start">
                    <View className="w-6 h-6 bg-white rounded-full shadow-sm" />
                </View>
                <Text className="text-xs text-gray-400">Distracted</Text>
            </View>
            <View className="items-center space-y-2">
                <View className="w-16 h-8 bg-green-500 rounded-full p-1 justify-center items-end">
                     <View className="w-6 h-6 bg-white rounded-full shadow-sm" />
                </View>
                 <Text className="text-xs text-green-500 font-bold">Focused</Text>
            </View>
        </View>
      </View>

      <View className="w-full space-y-4">
        <TouchableOpacity 
            onPress={handleNext}
            className="w-full bg-pink-500 py-4 rounded-2xl items-center shadow-lg shadow-pink-500/20 active:scale-95 transition-transform"
        >
            <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                Get Started
            </Text>
        </TouchableOpacity>
        
        <Text className="text-center text-xs text-gray-400 px-8">
            By tapping Get Started, you agree to our Privacy Policy and Terms.
        </Text>
      </View>
    </View>
  );

  const renderSoundFamiliarStep = () => (
    <View className="flex-1 items-center justify-between py-8 px-6">
        
        {/* Top Icon */}
        <View className="mt-8 mb-4">
           {/* Eyes looking - using two toggles to mimic the screenshot's 'eyes' */}
           <View className="flex-row space-x-4">
                <View className="w-16 h-10 bg-gray-700 rounded-full p-1 justify-center items-end rotate-12">
                     <View className="w-8 h-8 bg-gray-400 rounded-full" />
                </View>
                 <View className="w-16 h-10 bg-gray-700 rounded-full p-1 justify-center items-end -rotate-12">
                     <View className="w-8 h-8 bg-gray-400 rounded-full" />
                </View>
           </View>
        </View>

        <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-center text-white mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                Sound familiar?
            </Text>
             <Text className="text-base text-center text-gray-400" style={{ fontFamily: 'Outfit_400Regular' }}>
                Tap what resonates with you
            </Text>
        </View>

        <View className="w-full space-y-3 mb-8">
            {[
                "A. \"Just a quick check\" turned into an hour-long scroll",
                "B. Checked the time, now it's way past bedtime",
                "C. Battery at 20%, but couldn't put it down",
                "D. One article led to a whole afternoon of reading"
            ].map((text, index) => (
                <TouchableOpacity key={index} className="w-full bg-gray-900/80 p-5 rounded-2xl border border-gray-800">
                    <Text className="text-white text-base" style={{ fontFamily: 'Outfit_400Regular' }}>{text}</Text>
                </TouchableOpacity>
            ))}
        </View>

         <View className="w-full">
            <TouchableOpacity 
                onPress={handleNext}
                className="w-full bg-pink-500 py-4 rounded-2xl items-center shadow-lg shadow-pink-500/20 active:scale-95 transition-transform"
            >
                <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
                    It's me
                </Text>
            </TouchableOpacity>
        </View>

    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {currentStep === 0 && renderWelcomeStep()}
      {currentStep === 1 && renderSoundFamiliarStep()}
    </SafeAreaView>
  );
};
