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
  
  // Generate last 7 days based on selectedDate or Today
  // If selectedDate is far in past/future, we center around it or end at it?
  // User asked: "if showing is today screen time data then bind today in the calendar showing like dates and make the dates dynamic"
  // "if i am in januvary then 10 then 9,8,7,6,5,5 should be there"
  
  // Impl: We will show 7 days ENDING at the current view date (or today if selected is today)
  // Actually, standard behavior is a sliding window. 
  // Let's generate a window of 7 days around the selected date, or ending at 'Today' if selected is today.
  
  const dates = [];
  const today = new Date();
  const todayDate = today.getDate();
  
  // We'll create 7 days ending with 'selectedDate' (if it's today or past) 
  // OR just last 7 days if selectedDate is today.
  // Using a simple approach: Show [selectedDate - 6, ... selectedDate]
  
  // Note: This needs proper Date object manipulation to handle month boundaries
  // But current HomeScreen uses just 'date' number (1-31). This is a limitation of the current MVP.
  // To fix strictly: HomeScreen needs to pass full Timestamp or Date object.
  // For now, let's assume valid 'date' numbers for current month to match MVP state, 
  // but adding a TODO for full Date support is wise.
  
  // Dynamic generation for MVP (Current Month assumed for simplicity as per existing state)
  for (let i = 6; i >= 0; i--) {
      const d = new Date();
      // We assume selectedDate is in current month/year context from HomeScreen
      // If we want to support full navigation, we need full date state in HomeScreen.
      // For this MVP step, we'll anchor to 'today' and show the last 7 days.
      d.setDate(today.getDate() - i);
      dates.push({
          day: d.toLocaleString('en-US', { weekday: 'narrow' }), // S, M, T...
          date: d.getDate(),
          isToday: d.getDate() === today.getDate()
      });
  }

  return (
    <View className="px-4 py-4 flex-row justify-between items-center bg-black z-10">
      <TouchableOpacity 
        onPress={onOpenDatePicker}
        className="mr-2 active:opacity-70"
      >
        <Text className="text-white font-bold text-lg">{currentYear}</Text>
        <View className="flex-row items-center border border-zinc-800 rounded-full px-3 py-1 bg-zinc-900 mt-1">
          <Text className="text-pink-500 text-xs font-bold mr-1">{currentMonth}</Text>
          <Ionicons name="chevron-down" size={12} color="#ec4899" />
        </View>
      </TouchableOpacity>

      <View className="flex-1 flex-row justify-between ml-2">
        {dates.map((item, index) => {
          const isSelected = item.date === selectedDate;
          const isToday = item.isToday;
          
          return (
            <TouchableOpacity 
              key={index} 
              onPress={() => onSelectDate(item.date)}
              className={`items-center justify-center w-10 h-14 rounded-2xl ${isSelected ? 'bg-pink-500' : 'bg-transparent'}`}
            >
              <Text className={`text-[10px] mb-1 font-medium ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                {item.day}
              </Text>
              <View className={`w-7 h-7 items-center justify-center rounded-full ${isToday && !isSelected ? 'bg-zinc-800' : ''}`}>
                 <Text className={`text-base font-bold ${isSelected ? 'text-white' : 'text-white'}`}>
                    {item.date}
                 </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

DateStrip.displayName = 'DateStrip';
