import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Svg, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import ScreenTimeModule, { getUsageStats } from '../../../modules/screen-time';
import { formatDuration } from '../../../utils/screenTimeData';

interface ScreenTimeReportStepProps {
  onNext: () => void;
  screenTimeGoal: number; // in hours
}

export const ScreenTimeReportStep: React.FC<ScreenTimeReportStepProps> = ({ onNext, screenTimeGoal }) => {
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState<{ day: string, duration: number }[]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [viewMode, setViewMode] = useState<'Day' | 'Week'>('Week');

  const { width, height: screenHeight } = Dimensions.get('window');
  const CHART_WIDTH = width - 48;
  const CHART_HEIGHT = screenHeight * 0.42; 
  const MAX_BAR_HEIGHT = CHART_HEIGHT - 60;
  const LABEL_WIDTH = 30; 

  // Day labels for the last 7 days (including today)
  const getDays = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push({
        label: days[date.getDay()],
        timestamp: date.getTime(),
        startOfDay: new Date(date.setHours(0, 0, 0, 0)).getTime(),
        endOfDay: new Date(date.setHours(23, 59, 59, 999)).getTime()
      });
    }
    return result;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch each day's total usage
        const dailyPromises = getDays.map(async (day) => {
          const stats = await getUsageStats(day.startOfDay, day.endOfDay);
          const totalDuration = Object.values(stats.daily || {}).reduce((sum, val) => (sum as number) + (val as number), 0);
          return {
            day: day.label,
            duration: (totalDuration as number) / 1000 // duration from native is in ms
          };
        });

        const results = await Promise.all(dailyPromises);
        setWeekData(results);
        setTotalSeconds(results.reduce((sum, d) => sum + d.duration, 0));
      } catch (e) {
        console.error("Failed to fetch screen time data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDays]);

  const filteredWeekData = useMemo(() => {
    return weekData.filter(d => d.duration >= 300); // Only show days >= 5 mins
  }, [weekData]);

  const maxDuration = useMemo(() => {
    const weekMax = filteredWeekData.length > 0 ? Math.max(...filteredWeekData.map(d => d.duration)) : 0;
    const todayUsage = weekData.length > 0 ? weekData[weekData.length - 1].duration : 0;
    const goalSeconds = screenTimeGoal * 3600;
    
    const highestPoint = Math.max(weekMax, todayUsage, goalSeconds);
    const highestHours = Math.ceil(highestPoint / 3600);
    
    // Find next "nice" number for the top of the chart
    let targetHours = highestHours;
    if (targetHours < screenTimeGoal + 2) targetHours = Math.ceil(screenTimeGoal + 2);
    
    // Ensure it's even or multiple of 5 for better grid lines
    if (targetHours % 2 !== 0 && targetHours % 5 !== 0) {
        targetHours += 1;
    }
    
    return targetHours * 3600;
  }, [filteredWeekData, weekData, screenTimeGoal]);

  const chartScale = MAX_BAR_HEIGHT / maxDuration;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="#ff006e" size="large" />
      </View>
    );
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  // Stats for the header text
  const headerValue = viewMode === 'Week' ? `${hours}h ${minutes}m` : formatDuration(weekData.length > 0 ? weekData[weekData.length - 1].duration : 0);
  const headerSubLabel = viewMode === 'Week' ? 'Total for the last 7 days' : 'Today\'s screen time';

  return (
    <View className="flex-1 items-center bg-black pt-6 pb-6 px-6">
      <View className="flex-1 w-full items-center">
        {/* Eyes/Arcs Illustration - Reduced margin */}
        <View className="flex-row space-x-8 mb-4">
             <View className="w-20 h-12 bg-gray-600 rounded-t-full overflow-hidden relative">
                <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
             </View>
             <View className="w-20 h-12 bg-gray-600 rounded-t-full overflow-hidden relative">
                <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
             </View>
        </View>

        <Text className="text-3xl font-bold text-center text-white mb-0.5" style={{ fontFamily: 'Outfit_700Bold' }}>
          Your actual screen time
        </Text>
        <Text className="text-lg text-gray-500 mb-2" style={{ fontFamily: 'Outfit_400Regular' }}>
          {headerSubLabel}
        </Text>

        <Text className="text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit_700Bold' }}>
          {headerValue}
        </Text>

        {/* View Mode Toggle - Reduced margin */}
        <View className="bg-[#1c1c1e] rounded-full p-1 flex-row mb-6">
          <TouchableOpacity 
            onPress={() => setViewMode('Day')}
            className={`px-8 py-2 rounded-full ${viewMode === 'Day' ? 'bg-[#ff006e]' : ''}`}
          >
            <Text className={`font-bold text-sm ${viewMode === 'Day' ? 'text-white' : 'text-gray-500'}`}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setViewMode('Week')}
            className={`px-8 py-2 rounded-full ${viewMode === 'Week' ? 'bg-[#ff006e]' : ''}`}
          >
            <Text className={`font-bold text-sm ${viewMode === 'Week' ? 'text-white' : 'text-gray-500'}`}>Week</Text>
          </TouchableOpacity>
        </View>

        {/* Chart Container - flex-1 stretches between toggle and button */}
        <View className="flex-1 w-full justify-center">
            <View style={{ height: CHART_HEIGHT, width: CHART_WIDTH }}>
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                {/* 0h Base Line */}
                <Line x1="0" y1={MAX_BAR_HEIGHT} x2={CHART_WIDTH - LABEL_WIDTH} y2={MAX_BAR_HEIGHT} stroke="#3f3f46" strokeWidth="1" opacity="0.3" />
                <SvgText x={CHART_WIDTH} y={MAX_BAR_HEIGHT + 14} fontSize="10" fill="#71717a" textAnchor="end">0h</SvgText>

                {/* Grid Lines */}
                {(() => {
                    const steps = [];
                    const maxHours = Math.floor(maxDuration / 3600);
                    // Determine smart intervals
                    let interval = 2;
                    if (maxHours > 20) interval = 10;
                    else if (maxHours > 10) interval = 5;
                    
                    for (let h = interval; h <= maxHours; h += interval) {
                        steps.push(h);
                    }
                    return steps.map(h => (
                        <G key={h}>
                            <Line 
                                x1="0" 
                                y1={MAX_BAR_HEIGHT - (h * 3600 * chartScale)} 
                                x2={CHART_WIDTH - LABEL_WIDTH} 
                                y2={MAX_BAR_HEIGHT - (h * 3600 * chartScale)} 
                                stroke="#3f3f46" 
                                strokeWidth="1" 
                                opacity="0.2" 
                                strokeDasharray={viewMode === 'Day' ? "4,4" : undefined}
                            />
                            <SvgText x={CHART_WIDTH} y={MAX_BAR_HEIGHT - (h * 3600 * chartScale) + 4} fontSize="10" fill="#71717a" textAnchor="end">{`${h}h`}</SvgText>
                        </G>
                    ));
                })()}

                {viewMode === 'Week' ? (
                    <>
                        {/* Goal line */}
                        <Line x1="0" y1={MAX_BAR_HEIGHT - (screenTimeGoal * 3600 * chartScale)} x2={CHART_WIDTH - LABEL_WIDTH} y2={MAX_BAR_HEIGHT - (screenTimeGoal * 3600 * chartScale)} stroke="white" strokeWidth="1.5" strokeDasharray="4,4" />
                        <SvgText x="5" y={MAX_BAR_HEIGHT - (screenTimeGoal * 3600 * chartScale) - 8} fontSize="16" fontWeight="bold" fill="white">Goal</SvgText>

                        {/* Bars - Accounting for LABEL_WIDTH */}
                        {filteredWeekData.map((item, index) => {
                            const availableWidth = CHART_WIDTH - LABEL_WIDTH;
                            const barWidth = 32;
                            const barSlot = availableWidth / filteredWeekData.length;
                            const barHeight = Math.max(item.duration * chartScale, 4);
                            const x = index * barSlot + (barSlot - barWidth) / 2;
                            const y = MAX_BAR_HEIGHT - barHeight;
                            const barColor = item.duration > (screenTimeGoal * 3600) ? '#ff453a' : '#facc15';
                            return (
                                <G key={index}>
                                    <Rect x={x} y={y} width={barWidth} height={barHeight} fill={barColor} rx={8} />
                                    <SvgText x={x + barWidth / 2} y={MAX_BAR_HEIGHT + 20} fontSize="12" fill="#a1a1aa" textAnchor="middle">{item.day}</SvgText>
                                </G>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {(() => {
                            const availableWidth = CHART_WIDTH - LABEL_WIDTH;
                            const barWidth = 100;
                            const barSlot = availableWidth / 2;
                            const todayUsage = weekData.length > 0 ? weekData[weekData.length - 1].duration : 0;
                            const goalHeight = Math.max((screenTimeGoal * 3600) * chartScale, 4);
                            const realHeight = Math.max(todayUsage * chartScale, 4);
                            return (
                                <>
                                    <G>
                                        <Rect x={barSlot/2 - barWidth/2} y={MAX_BAR_HEIGHT - goalHeight} width={barWidth} height={goalHeight} fill="#bbe73c" rx={24} />
                                        <SvgText x={barSlot/2} y={MAX_BAR_HEIGHT + 30} fontSize="14" fill="#a1a1aa" textAnchor="middle">Goal</SvgText>
                                    </G>
                                    <G>
                                        <Rect x={barSlot + barSlot/2 - barWidth/2} y={MAX_BAR_HEIGHT - realHeight} width={barWidth} height={realHeight} fill="#ffeb3b" rx={24} />
                                        <SvgText x={barSlot + barSlot/2} y={MAX_BAR_HEIGHT + 30} fontSize="14" fill="#a1a1aa" textAnchor="middle">Real</SvgText>
                                    </G>
                                </>
                            );
                        })()}
                    </>
                )}
              </Svg>
            </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={onNext}
        className="w-full rounded-full bg-[#ff006e] py-5 items-center shadow-lg shadow-pink-500/30 active:scale-95 transition-transform mt-4"
      >
        <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};
