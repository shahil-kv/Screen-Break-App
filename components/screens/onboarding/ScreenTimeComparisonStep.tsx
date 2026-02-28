import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { getUsageStats } from '../../../modules/screen-time';

interface ScreenTimeComparisonStepProps {
  onNext: () => void;
  preFetchedData?: any;
}

export const ScreenTimeComparisonStep: React.FC<ScreenTimeComparisonStepProps> = ({ 
  onNext,
  preFetchedData 
}) => {
  const [loading, setLoading] = useState(!preFetchedData);
  const [yearlyHours, setYearlyHours] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (preFetchedData) {
      calculateYearly(preFetchedData.daily || preFetchedData);
      setLoading(false);
      return;
    }
    fetchData();
  }, [preFetchedData]);

  const calculateYearly = (dailyStats: Record<string, number>) => {
    const weeklyTotalSeconds = Object.values(dailyStats).reduce((sum: number, val: number) => sum + val, 0) / 1000;
    
    // Project to a year
    const projectedYearlyHours = Math.round((weeklyTotalSeconds / 7) * 365 / 3600);
    setYearlyHours(projectedYearlyHours);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const end = now.getTime();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();

      const usageData = await getUsageStats(start, end);
      calculateYearly(usageData.daily || {});
    } catch (e) {
      console.error("Failed to fetch usage data for comparison", e);
    } finally {
      setLoading(false);
    }
  };

  const comparisons = useMemo(() => [
    {
      title: "Read Books",
      value: Math.floor(yearlyHours / 15),
      description: `Estimated at 15 hours per book, this allows for a broad exploration of knowledge in literature, history, psychology, and practical skills.`
    },
    {
      title: "Learn a Language",
      value: Math.floor(yearlyHours / 480),
      description: `Enough time to reach B1 level proficiency in a new language. You could communicate fluently with millions of new people around the world.`
    },
    {
      title: "Learn a New Skill",
      value: Math.floor(yearlyHours / 100),
      label: "Skills",
      description: `You could master several high-value skills like coding, graphic design, or playing a musical instrument with this much dedicated time.`
    },
    {
      title: "Exercise Regularly",
      value: Math.floor(yearlyHours / 3),
      label: "Workouts",
      description: `That's enough time for nearly a daily workout session, leading to a complete transformation in your health and fitness levels.`
    }
  ], [yearlyHours]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-lg">Calculating your potential...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black pt-6 pb-6">
      <View className="items-center w-full px-6 mb-8">
        {/* Eyes Illustration */}
        <View className="flex-row space-x-8 mb-6">
          <View className="w-20 h-10 bg-gray-600 rounded-t-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
          </View>
          <View className="w-20 h-10 bg-gray-600 rounded-t-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
          </View>
        </View>

        <Text className="text-4xl font-bold text-center text-white mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
          One Year of Screen Time
        </Text>
        <Text className="text-lg text-gray-500 text-center" style={{ fontFamily: 'Outfit_400Regular' }}>
          Discover what these hours could become
        </Text>
        
        <Text className="text-6xl font-bold text-white mt-6" style={{ fontFamily: 'Outfit_700Bold' }}>
          {yearlyHours.toLocaleString()} hours
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
        >
          {comparisons.map((item, index) => (
            <View key={index} style={{ width }} className="px-10 items-center justify-center">
              <Text className="text-white text-3xl font-bold italic border-b-2 border-white mb-6 pb-1" style={{ fontFamily: 'Outfit_700Bold' }}>
                {item.title} {item.value} {item.label || (item.value === 1 ? 'Book' : 'Books')}
              </Text>
              <Text className="text-gray-300 text-xl text-center leading-8" style={{ fontFamily: 'Outfit_400Regular' }}>
                {item.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="flex-row justify-center space-x-2 mb-10">
        {comparisons.map((_, index) => (
          <View
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${activeIndex === index ? 'bg-[#bbe73c]' : 'bg-gray-800'}`}
          />
        ))}
      </View>

      <View className="px-6">
        <TouchableOpacity
          onPress={onNext}
          className="w-full rounded-full bg-[#ff006e] py-5 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
        >
          <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
