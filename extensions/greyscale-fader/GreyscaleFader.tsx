import React from 'react';
import { View, Text, Switch } from 'react-native';
import { ScreenBreak } from '../../core/sdk';

/**
 * Greyscale Fader Extension
 * 
 * Logic:
 * - Simple toggle to turn the entire screen Black & White.
 */

export const GreyscaleFader = () => {
  const [enabled, setEnabled] = React.useState(false);

  const toggleGreyscale = async (value: boolean) => {
    setEnabled(value);
    // 1.0 = Full B&W, 0.0 = Full Color
    await ScreenBreak.visuals.setGrayscale(value ? 1.0 : 0.0);
  };

  return (
    <View className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">Greyscale Fader</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Manually force your screen into Black & White mode to reduce dopamine.
          </Text>
        </View>
        <Switch 
          value={enabled} 
          onValueChange={toggleGreyscale}
          trackColor={{ false: '#3a3a3c', true: '#ffffff' }}
          thumbColor={enabled ? '#000000' : '#f4f3f4'}
        />
      </View>
      
      <View className="mt-2 flex-row items-center">
        <View className={`w-2 h-2 rounded-full mr-2 ${enabled ? 'bg-green-500' : 'bg-gray-600'}`} />
        <Text className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          {enabled ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
  );
};
