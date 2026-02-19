import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DATES = [8, 9, 10, 11, 12, 13, 14];

interface Props {
  currentYear: number;
  currentMonth: string;
  selectedDate: number;
  onSelectDate: (date: number) => void;
  onOpenDatePicker: () => void;
}

export const DateStrip = memo(({ 
  currentYear, 
  currentMonth, 
  selectedDate, 
  onSelectDate, 
  onOpenDatePicker 
}: Props) => {
  return (
    <View className="px-5 py-4 flex-row justify-between items-center bg-black z-10">
      <TouchableOpacity 
        onPress={onOpenDatePicker}
        className="mr-4 active:opacity-70"
      >
        <Text className="text-white font-bold text-lg">{currentYear}</Text>
        <View className="flex-row items-center border border-zinc-800 rounded-full px-2 py-1 bg-zinc-900 mt-1">
          <Text className="text-pink-500 text-sm font-bold mr-1">{currentMonth}</Text>
          <Ionicons name="chevron-down" size={12} color="#ec4899" />
        </View>
      </TouchableOpacity>

      <View className="flex-1 flex-row justify-between">
        {DAYS.map((day, index) => {
          const date = DATES[index];
          const isSelected = date === selectedDate;
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => onSelectDate(date)}
              className={`items-center justify-center w-8 h-12 rounded-xl ${isSelected ? 'bg-pink-500' : 'bg-transparent'}`}
            >
              <Text className={`text-xs mb-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>{day}</Text>
              <Text className={`text-base font-bold ${isSelected ? 'text-white' : 'text-white'}`}>{date}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

DateStrip.displayName = 'DateStrip';
