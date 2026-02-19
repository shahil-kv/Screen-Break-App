import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PermissionBannerProps {
  onPress: () => void;
}

export const PermissionBanner: React.FC<PermissionBannerProps> = ({ onPress }) => {
  return (
    <View className="mx-5 mb-4 p-4 bg-zinc-800 rounded-xl flex-row items-center justify-between border border-pink-500/30">
        <View className="flex-1 mr-3">
            <Text className="text-white font-bold text-base mb-1">Permission Required</Text>
            <Text className="text-zinc-400 text-xs">
                Enable "Usage Access" to see real screen time data.
            </Text>
        </View>
        <TouchableOpacity 
            onPress={onPress}
            className="bg-pink-500 px-4 py-2 rounded-lg"
        >
            <Text className="text-white font-bold text-sm">Grant</Text>
        </TouchableOpacity>
    </View>
  );
};
