import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WelcomeStep } from './onboarding/WelcomeStep';
import { SoundFamiliarStep } from './onboarding/SoundFamiliarStep';
import { ScreenTimeGoalStep } from './onboarding/ScreenTimeGoalStep';
import { PermissionStep } from './onboarding/PermissionStep';
import { ScreenTimeReportStep } from './onboarding/ScreenTimeReportStep';
import { AppUsageStep } from './onboarding/AppUsageStep';
import { ScreenTimeComparisonStep } from './onboarding/ScreenTimeComparisonStep';
import { ReclaimTimeStep } from './onboarding/ReclaimTimeStep';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(0);
  const [screenTimeGoal, setScreenTimeGoal] = useState(4);

  const TOTAL_STEPS = 8; 

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
        handleFinishOnboarding();
    }
  };

  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.replace('Main');
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
      {currentStep === 3 && (
        <PermissionStep onPermissionGranted={handleNext} />
      )}
      {currentStep === 4 && (
        <ScreenTimeReportStep 
            onNext={handleNext} 
            screenTimeGoal={screenTimeGoal}
        />
      )}
      {currentStep === 5 && (
        <AppUsageStep onNext={handleNext} />
      )}
      {currentStep === 6 && (
        <ScreenTimeComparisonStep onNext={handleNext} />
      )}
      {currentStep === 7 && (
        <ReclaimTimeStep onNext={handleNext} />
      )}
    </SafeAreaView>
  );
};
