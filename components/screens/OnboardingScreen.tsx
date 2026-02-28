import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WelcomeStep } from './onboarding/WelcomeStep';
import { SoundFamiliarStep } from './onboarding/SoundFamiliarStep';
import { ScreenTimeGoalStep } from './onboarding/ScreenTimeGoalStep';

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [screenTimeGoal, setScreenTimeGoal] = useState(4);

  // Temporary total steps until we define all 5-6
  const TOTAL_STEPS = 3; 

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

  return (
    <SafeAreaView className="flex-1 bg-black">
      {currentStep === 0 && <WelcomeStep onNext={handleNext} />}
      {currentStep === 1 && <SoundFamiliarStep onNext={handleNext} />}
      {currentStep === 2 && (
        <ScreenTimeGoalStep 
            onNext={handleNext} 
            screenTimeGoal={screenTimeGoal}
            setScreenTimeGoal={setScreenTimeGoal}
        />
      )}
    </SafeAreaView>
  );
};
