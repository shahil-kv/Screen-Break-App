import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { Svg, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { HourlyUsage, DailyUsage } from '../utils/screenTimeData';

const CHART_HEIGHT = 200;
const MAX_BAR_HEIGHT = 150;

interface Props {
    selectedDate: number;
    selectedHour: number | null;
    selectedAppId: string | null;
    onSelectHour: (hour: number | null) => void;
    dailyData?: DailyUsage; // Added prop
}

export const ScreenTimeChart: React.FC<Props> = ({ selectedDate, selectedHour, selectedAppId, onSelectHour, dailyData }) => {
    const { width } = useWindowDimensions();
    // Make chart wider than screen to enable scrolling. 
    // 24 hours * ~40px per bar = 960px. Let's maximize visibility.
    const CHART_WIDTH = Math.max(width * 2, 800); 

    const data = dailyData;
    
    // Memoize the calculation of hourly values and max duration to prevent re-calc on every render
    const chartData = useMemo(() => {
        if (!data) return null;

        // FILTER: Only keep hours with usage > 0
        const activeHours = data.hourly.filter(h => {
             // If specific app selected, check if THAT app was used
             if (selectedAppId) {
                 return h.apps.some(a => a.id === selectedAppId && a.duration > 0);
             }
             return h.totalDuration > 0; // Otherwise check total
        });

        // Map to display values
        const displayItems = activeHours.map(h => {
             let value = h.totalDuration;
             let color = "#333333"; // default

             if (selectedAppId) {
                 const app = h.apps.find(a => a.id === selectedAppId);
                 value = app ? app.duration : 0;
                 color = app?.color || "#ec4899";
             } else {
                 // Dynamic color based on intensity
                 const minutes = value / 60;
                 if (minutes < 20) color = "#4ade80"; 
                 else if (minutes < 45) color = "#facc15"; 
                 else color = "#f87171"; 
             }
             
             return {
                 hour: h.hour,
                 value,
                 color
             };
        });

        const maxDuration = Math.max(...displayItems.map(d => d.value), 60); // Minimum 1 min scale

        return { displayItems, maxDuration };
    }, [data, selectedAppId]);

    if (!data || !chartData) return <Text className="text-white">No Data</Text>;
    if (chartData.displayItems.length === 0) return (
        <View className="w-full h-[220px] items-center justify-center">
            <Text className="text-gray-500">No usage recorded for this period.</Text>
        </View>
    );

    const { displayItems, maxDuration } = chartData;
    const itemCount = displayItems.length;
    
    // Dynamic Width Calculation
    // Ensure at least 40px per bar + gaps
    const minBarWidth = 40; 
    const minGap = 10;
    const minSlotWidth = minBarWidth + minGap;
    const contentWidth = Math.max(width - 40, itemCount * minSlotWidth);
    
    return (
        <View className="w-full h-[220px] items-center justify-center bg-transparent relative">
             <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ width: contentWidth, height: '100%' }}
                style={{ width: width - 40 }}
             >
                <View className="flex-1 w-full h-full relative">
                    {/* Grid Lines (Background - Fixed to content width) */}
                    <Svg width={contentWidth} height={MAX_BAR_HEIGHT} style={{ position: 'absolute', top: 20 }}>
                        {[0, 0.5, 1].map((ratio) => (
                            <Line
                                key={ratio}
                                x1="0"
                                y1={MAX_BAR_HEIGHT * ratio}
                                x2={contentWidth}
                                y2={MAX_BAR_HEIGHT * ratio}
                                stroke="#3f3f46" // Zinc 700
                                strokeDasharray="4 4"
                                strokeOpacity="0.5"
                            />
                        ))}
                    </Svg>
        
                    {/* Visual Bars (SVG) */}
                    <Svg width={contentWidth} height={CHART_HEIGHT}>
                        {displayItems.map((item, index) => {
                            const barHeight = (item.value / maxDuration) * MAX_BAR_HEIGHT;
                            
                            // Slot width distributes space evenly if contentWidth > min needed
                            const barSlotWidth = contentWidth / itemCount;
                            const barWidth = Math.min(barSlotWidth * 0.7, 50); // Cap width at 50
                            const gap = (barSlotWidth - barWidth) / 2;
                            
                            const x = index * barSlotWidth + gap;
                            const y = MAX_BAR_HEIGHT - barHeight + 20; // +20 offset for top padding
                            
                            const isSelected = selectedHour === item.hour;
                            
                            // Formatter for label (e.g. 9AM)
                            const labelText = item.hour === 0 ? '12A' : item.hour === 12 ? '12P' : item.hour > 12 ? `${item.hour-12}P` : `${item.hour}A`;
    
                            // Selection Style: Keep color, add stroke/shadow effect
                            const opacity = selectedHour !== null && !isSelected ? 0.3 : 1;
                            const stroke = isSelected ? "white" : "none";
                            const strokeWidth = isSelected ? 2 : 0;
    
                            return (
                                <G key={item.hour}>
                                    <Rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={item.color}
                                        rx={6} // More rounded
                                        opacity={opacity}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                    />
                                    {/* Label */}
                                    <SvgText
                                        x={index * barSlotWidth + (barSlotWidth / 2)}
                                        y={MAX_BAR_HEIGHT + 40} // Below bars
                                        fontSize="10"
                                        fill={isSelected ? "white" : "gray"}
                                        fontWeight={isSelected ? "bold" : "normal"}
                                        textAnchor="middle"
                                    >
                                        {labelText}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </Svg>

                    {/* Touch Overlay - Robust Touch Handling */}
                    <View style={{ position: 'absolute', top: 0, left: 0, width: contentWidth, height: '100%', flexDirection: 'row' }}>
                         {displayItems.map((item) => {
                             const barSlotWidth = contentWidth / itemCount;
                             return (
                                <TouchableOpacity 
                                    key={item.hour}
                                    onPress={() => onSelectHour(selectedHour === item.hour ? null : item.hour)}
                                    style={{ width: barSlotWidth, height: '100%' }}
                                    activeOpacity={0.5}
                                />
                             );
                         })}
                    </View>
                </View>
             </ScrollView>
        </View>
    );
};
