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

        // FILTER: Only keep hours with usage >= 5 minutes (300 seconds)
        const activeHours = data.hourly.filter(h => {
             // If specific app selected, check if THAT app was used > 5 mins
             if (selectedAppId) {
                 return h.apps.some(a => a.id === selectedAppId && a.duration >= 300);
             }
             return h.totalDuration >= 300; // Otherwise check total >= 5 mins
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
                 else color = "#ef4444";  // Red-500 
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
    
    // Dynamic Width Calculation (Fit to Screen)
    const totalAvailableWidth = width - 40; // Screen width minus padding
    const barSlotWidth = totalAvailableWidth / Math.max(itemCount, 3); // Divide by item count (min 3 to prevent single huge bar)
    
    // Bar width logic: 
    // - Try to fill 65% of the slot
    // - But cap it at 60px max (so 2 bars don't look like walls)
    // - And ensure min width of 4px for visibility if super crowded
    let barWidth = Math.min(barSlotWidth * 0.65, 60); 
    barWidth = Math.max(barWidth, 4); 

    const gap = (barSlotWidth - barWidth) / 2;

    return (
        <View className="w-full h-[220px] items-center justify-center bg-transparent relative">
             <View style={{ width: totalAvailableWidth, height: '100%', position: 'relative' }}>
                {/* Grid Lines (Background) */}
                <Svg width={totalAvailableWidth} height={MAX_BAR_HEIGHT} style={{ position: 'absolute', top: 20 }}>
                    {[0, 0.5, 1].map((ratio) => (
                        <Line
                            key={ratio}
                            x1="0"
                            y1={MAX_BAR_HEIGHT * ratio}
                            x2={totalAvailableWidth}
                            y2={MAX_BAR_HEIGHT * ratio}
                            stroke="#3f3f46" // Zinc 700
                            strokeDasharray="4 4"
                            strokeOpacity="0.5"
                        />
                    ))}
                </Svg>
    
                {/* Visual Bars (SVG) */}
                <Svg width={totalAvailableWidth} height={CHART_HEIGHT}>
                    {displayItems.map((item, index) => {
                        const barHeight = (item.value / maxDuration) * MAX_BAR_HEIGHT;
                        const x = index * barSlotWidth + gap;
                        const y = MAX_BAR_HEIGHT - barHeight + 20; // +20 offset for top padding
                        
                        // Formatter: Smart labels. 
                        // If bars are too thin (<25px), show fewer labels to avoid overlapping
                        const isSelected = selectedHour === item.hour;
                        const showLabel = barSlotWidth > 25 || index % 2 === 0 || isSelected;
                        const labelText = item.hour === 0 ? '12AM' : item.hour === 12 ? '12PM' : item.hour > 12 ? `${item.hour-12}PM` : `${item.hour}AM`;

                        // Opacity: If something is selected, fade others.
                        const opacity = selectedHour !== null && !isSelected ? 0.3 : 1;
                        const stroke = isSelected ? "white" : "none";
                        const strokeWidth = isSelected ? 2 : 0;
                        
                        // Fix Red Color: Use stronger Red
                        const finalColor = item.color === "#f87171" ? "#ef4444" : item.color;

                        return (
                            <G key={item.hour}>
                                <Rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={finalColor}
                                    rx={barWidth > 10 ? 6 : 2} // Round less if thin
                                    opacity={opacity}
                                    stroke={stroke}
                                    strokeWidth={strokeWidth}
                                />
                                {showLabel && (
                                    <SvgText
                                        x={index * barSlotWidth + (barSlotWidth / 2)}
                                        y={MAX_BAR_HEIGHT + 40} // Below bars
                                        fontSize={Math.min(10, barSlotWidth * 0.4)} // Scale font if needed
                                        fill={isSelected ? "white" : "gray"}
                                        fontWeight={isSelected ? "bold" : "normal"}
                                        textAnchor="middle"
                                    >
                                        {labelText}
                                    </SvgText>
                                )}
                            </G>
                        );
                    })}
                </Svg>

                {/* Touch Overlay - Matches Slots Exactly */}
                <View style={{ position: 'absolute', top: 0, left: 0, width: totalAvailableWidth, height: '100%', flexDirection: 'row' }}>
                        {displayItems.map((item) => (
                        <TouchableOpacity 
                            key={item.hour}
                            onPress={() => onSelectHour(selectedHour === item.hour ? null : item.hour)}
                            style={{ width: barSlotWidth, height: '100%' }}
                            activeOpacity={0.5}
                        />
                        ))}
                </View>
            </View>
        </View>
    );
};
