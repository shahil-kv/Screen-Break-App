import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  showBack?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  showBack = true 
}) => {
  const { width } = Dimensions.get('window');
  const progress = (currentStep + 1) / totalSteps;
  const progressBarWidth = width - 80;

  return (
    <View className="flex-row items-center px-6 py-4 bg-black">
      {/* Back Button */}
      <View style={{ width: 32 }}>
        {showBack && (
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar Container */}
      <View className="flex-1 mx-4 h-1 bg-gray-800 rounded-full overflow-hidden">
        <View 
          className="h-full bg-white rounded-full" 
          style={{ width: `${progress * 100}%` }} 
        />
      </View>

      {/* Spacer for centering */}
      <View style={{ width: 32 }} />
    </View>
  );
};
