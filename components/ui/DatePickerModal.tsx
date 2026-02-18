import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedYear: number;
  selectedMonth: string;
  onSelect: (year: number, month: string) => void;
}

const YEARS = [2025, 2026, 2027];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DatePickerModal: React.FC<Props> = ({ visible, onClose, selectedYear, selectedMonth, onSelect }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View className="flex-1 bg-black/80 justify-end">
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        
        <Animated.View 
            entering={FadeInUp.springify()} 
            exiting={FadeOutDown}
            className="bg-zinc-900 rounded-t-3xl border-t border-zinc-800 p-6 pb-10"
        >
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-xl font-bold">Select Date</Text>
                <TouchableOpacity onPress={onClose} className="bg-zinc-800 p-2 rounded-full">
                    <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Years */}
            <Text className="text-gray-500 text-sm mb-3 font-bold uppercase">Year</Text>
            <View className="flex-row mb-6">
                {YEARS.map(year => (
                    <TouchableOpacity 
                        key={year}
                        onPress={() => onSelect(year, selectedMonth)}
                        className={`mr-3 px-5 py-3 rounded-2xl ${selectedYear === year ? 'bg-pink-500' : 'bg-zinc-800'}`}
                    >
                        <Text className={`font-bold ${selectedYear === year ? 'text-white' : 'text-gray-400'}`}>{year}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Months */}
            <Text className="text-gray-500 text-sm mb-3 font-bold uppercase">Month</Text>
            <View className="flex-wrap flex-row gap-3">
                {MONTHS.map(month => (
                    <TouchableOpacity 
                        key={month}
                        onPress={() => onSelect(selectedYear, month)}
                        className={`w-[22%] items-center py-3 rounded-2xl ${selectedMonth === month ? 'bg-zinc-700 border border-pink-500' : 'bg-zinc-800'}`}
                    >
                        <Text className={`font-bold ${selectedMonth === month ? 'text-white' : 'text-gray-400'}`}>{month}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </Animated.View>
      </View>
    </Modal>
  );
};
