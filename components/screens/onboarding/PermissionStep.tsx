import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import ScreenTimeModule, { hasPermission, requestPermission } from '../../../modules/screen-time';

interface PermissionStepProps {
  onPermissionGranted: () => void;
}

export const PermissionStep: React.FC<PermissionStepProps> = ({ onPermissionGranted }) => {
  const [checking, setChecking] = useState(false);

  const checkPermissionAndProceed = async () => {
    const granted = await hasPermission();
    if (granted) {
      onPermissionGranted();
    }
  };

  const handleGivePermission = async () => {
    const granted = await hasPermission();
    if (granted) {
      onPermissionGranted();
    } else {
      requestPermission();
      setChecking(true);
    }
  };

  useEffect(() => {
    // Initial check on mount
    checkPermissionAndProceed();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && checking) {
        checkPermissionAndProceed();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checking]);

  return (
    <View className="flex-1 items-center justify-between py-8 px-6 bg-black">
      <View className="flex-1 justify-center items-center w-full">
        {/* Eyes/Circles Illustration */}
        <View className="flex-row space-x-12 mb-12">
          <View className="w-24 h-16 bg-white rounded-full overflow-hidden relative">
             <View className="absolute right-2 top-2 w-12 h-12 bg-gray-600 rounded-full" />
          </View>
          <View className="w-24 h-16 bg-white rounded-full overflow-hidden relative">
             <View className="absolute left-2 top-2 w-12 h-12 bg-gray-600 rounded-full" />
          </View>
        </View>

        <Text className="text-4xl font-bold text-center text-white mb-6 px-4" style={{ fontFamily: 'Outfit_700Bold' }}>
          Ready to see your real screen time?
        </Text>

        <Text className="text-lg text-center text-gray-400 px-6 leading-6" style={{ fontFamily: 'Outfit_400Regular' }}>
          Enable ScreenBreak to access Screen Time to generate your personal report. Your data stays private and never leaves your device.
        </Text>
      </View>

      <View className="w-full pb-8">
        <TouchableOpacity
          onPress={handleGivePermission}
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
