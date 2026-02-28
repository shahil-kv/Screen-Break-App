import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Svg, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { getUsageStats } from '../../../modules/screen-time';
import { formatDuration } from '../../../utils/screenTimeData';
import { Ionicons } from '@expo/vector-icons';

interface ReclaimTimeStepProps {
  onNext: () => void;
  preFetchedData?: any;
}

export const ReclaimTimeStep: React.FC<ReclaimTimeStepProps> = ({ 
  onNext,
  preFetchedData
}) => {
  const [loading, setLoading] = useState(!preFetchedData);
  const [todaySeconds, setTodaySeconds] = useState(0);
  const { width } = Dimensions.get('window');

  const CHART_WIDTH = width - 48;
  const BAR_HEIGHT = 40;
  const MAX_HOURS = 8; // Max scale for the chart

  useEffect(() => {
    if (preFetchedData && preFetchedData.weekHistory) {
      const todayData = preFetchedData.weekHistory[preFetchedData.weekHistory.length - 1];
      setTodaySeconds(todayData ? todayData.duration : 0);
      setLoading(false);
      return;
    }
    fetchData();
  }, [preFetchedData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

      const stats = await getUsageStats(startOfDay, endOfDay);
      const dailyStats: Record<string, number> = stats.daily || {};
      const totalDuration = Object.values(dailyStats).reduce((sum: number, val: number) => sum + val, 0);
      setTodaySeconds(totalDuration / 1000);
    } catch (e) {
      console.error("Failed to fetch today's usage for reclaim step", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#ff006e" size="large" />
      </View>
    );
  }

  const beforeHours = todaySeconds / 3600;
  const afterHours = beforeHours * 0.7; // 30% reduction
  const reclaimedHours = beforeHours - afterHours;

  const scale = (CHART_WIDTH - 80) / MAX_HOURS; // Leaving space for labels

  const benefits = [
    { title: "Save time", text: `Gain ${Math.round(reclaimedHours)} extra hours every day to spend with family or pursue your passions.` },
    { title: "Reduce distractions", text: "Increase efficiency and cut procrastination by 20%." },
    { title: "Improve focus", text: "Achieve goals 30% faster than your peers with better concentration." },
    { title: "Build lasting habits", text: "Save 45 days a year to make your life more fulfilling." }
  ];

  return (
    <View className="flex-1 bg-black pt-6 pb-6 px-6">
      <View className="items-center w-full mb-8">
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
          No worries, we've got you covered
        </Text>
        <Text className="text-lg text-gray-500 text-center" style={{ fontFamily: 'Outfit_400Regular' }}>
          See how much time you can reclaim. Estimated based on our user research
        </Text>
      </View>

      {/* Before/After Chart */}
      <View className="mb-10 items-center justify-center">
        <View style={{ height: 180, width: CHART_WIDTH }}>
          <Svg width={CHART_WIDTH} height={180}>
            {/* Grid Lines */}
            {[0, 2, 4, 6, 8].map(h => (
              <G key={h}>
                <Line
                  x1={h * scale}
                  y1="20"
                  x2={h * scale}
                  y2="140"
                  stroke="#3f3f46"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.3"
                />
                <SvgText x={h * scale} y="155" fontSize="10" fill="#71717a" textAnchor="middle">{h}h</SvgText>
              </G>
            ))}

            {/* Before Bar */}
            <Rect
              x="0"
              y="30"
              width={beforeHours * scale}
              height={BAR_HEIGHT}
              fill="#facc15"
              rx={8}
            />
            <SvgText 
              x={beforeHours * scale + 8} 
              y={30 + BAR_HEIGHT / 2 + 5} 
              fontSize="20" 
              fontWeight="bold" 
              fill="white"
            >
              {formatDuration(todaySeconds)}
            </SvgText>

            <SvgText x="0" y="25" fontSize="14" fill="#71717a" fontWeight="bold">Before</SvgText>

            {/* After Bar */}
            <Rect
              x="0"
              y="90"
              width={afterHours * scale}
              height={BAR_HEIGHT}
              fill="#bbe73c"
              rx={8}
            />
            <SvgText 
              x={afterHours * scale + 8} 
              y={90 + BAR_HEIGHT / 2 + 5} 
              fontSize="20" 
              fontWeight="bold" 
              fill="white"
            >
              {formatDuration(afterHours * 3600)}
            </SvgText>
            
            <SvgText x="0" y="85" fontSize="14" fill="#71717a" fontWeight="bold">After</SvgText>
          </Svg>

          {/* -30% Badge */}
          <View 
            className="absolute bg-[#00c853] px-3 py-1 rounded-full items-center justify-center"
            style={{ 
                left: afterHours * scale + 10, 
                top: 130 
            }}
          >
            <Text className="text-white font-bold text-sm">-30%</Text>
          </View>
        </View>
      </View>

      {/* Benefits List */}
      <View className="space-y-4 mb-auto">
        {benefits.map((benefit, index) => (
          <View key={index} className="flex-row items-start space-x-3 mb-2">
            <View className="bg-[#00c853] rounded-full p-1 mt-1 mr-2">
              <Ionicons name="checkmark" size={16} color="black" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg" style={{ fontFamily: 'Outfit_400Regular' }}>
                <Text className="font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>{benefit.title} :</Text> {benefit.text}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onNext}
        className="w-full rounded-full bg-[#ff006e] py-5 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
      >
        <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};
