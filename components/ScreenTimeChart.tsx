import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Svg, Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { MOCK_DATA, HourlyUsage } from '../utils/screenTimeData';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 200;
// Make chart wider than screen to enable scrolling. 
// 24 hours * ~40px per bar = 960px. Let's maximize visibility.
const CHART_WIDTH = Math.max(width * 2, 800); 
const MAX_BAR_HEIGHT = 150;

interface Props {
    selectedDate: number;
    selectedHour: number | null;
    selectedAppId: string | null;
    onSelectHour: (hour: number | null) => void;
}

export const ScreenTimeChart: React.FC<Props> = ({ selectedDate, selectedHour, selectedAppId, onSelectHour }) => {
    const data = MOCK_DATA[selectedDate];
    
    if (!data) return <Text className="text-white">No Data</Text>;

    // Calculate max value for scaling
    // If app selected: Max is the max duration of that app across all hours
    // If no app selected: Max is the max total duration of any hour
    const hourlyValues = data.hourly.map(h => {
        if (selectedAppId) {
            const app = h.apps.find(a => a.id === selectedAppId);
            return app ? app.duration : 0;
        }
        return h.totalDuration;
    });

    const maxDuration = Math.max(...hourlyValues, 60); // Minimum 1 min scale

    return (
        <View className="items-center justify-center py-4 bg-transparent">
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            >
                <View>
                    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                        {/* Y-Axis Lines (optional, maybe just 1hr marker) */}
                        <Line
                            x1="0" y1={MAX_BAR_HEIGHT - (3600 / Math.max(3600, maxDuration)) * MAX_BAR_HEIGHT}
                            x2={CHART_WIDTH} y2={MAX_BAR_HEIGHT - (3600 / Math.max(3600, maxDuration)) * MAX_BAR_HEIGHT}
                            stroke="gray"
                            strokeDasharray="4 4"
                            strokeOpacity="0.3"
                        />
                        
                        {/* Bars */}
                        {data.hourly.map((item, index) => {
                            const value = hourlyValues[index];
                            const barHeight = (value / maxDuration) * MAX_BAR_HEIGHT;
                            const barWidth = (CHART_WIDTH / 24) - 8; // Wider gap of 8
                            const x = index * (CHART_WIDTH / 24);
                            const y = MAX_BAR_HEIGHT - barHeight;
                            const isSelected = selectedHour === item.hour;
                            
                            // Logic: 
                            // 1. If App Selected -> Use App's Brand Color (or default pink if missing)
                            // 2. If No App Selected -> Color based on usage intensity (Green/Yellow/Red)
                            // 3. If Hour Selected -> White (Highlight)

                            let barColor = "#333333"; // Fallback
                            
                            if (selectedAppId) {
                                 // Find color from the data for this hour, or fallback to a known color if we can find it in any hour
                                 // We need a stable color for the app even if it has 0 usage in this specific hour.
                                 const stableAppColor = data.hourly.flatMap(h => h.apps).find(a => a.id === selectedAppId)?.color || "#ec4899";
                                 
                                 barColor = stableAppColor; 
                            } else {
                                // Intensity Coloring
                                const minutes = value / 60;
                                if (minutes < 15) barColor = "#4ade80"; // Green (Low)
                                else if (minutes < 40) barColor = "#facc15"; // Yellow (Medium)
                                else barColor = "#f87171"; // Red (High)
                            }

                            if (isSelected) barColor = "#ffffff"; // Selected Hour is always White

                            return (
                                <G key={index} onPress={() => onSelectHour(isSelected ? null : item.hour)}>
                                    {/* Tap Area (Invisible rect for easier tapping) */}
                                    <Rect
                                        x={x}
                                        y={0}
                                        width={barWidth + 8}
                                        height={CHART_HEIGHT}
                                        fill="transparent"
                                        onPress={() => onSelectHour(isSelected ? null : item.hour)}
                                    />
                                    {/* Visible Bar */}
                                    <Rect
                                        x={x + 4}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={barColor}
                                        rx={4}
                                    />
                                    {/* Label for specific hours. Now we show more labels since it scrolls. */}
                                    {index % 4 === 0 && (
                                        <SvgText
                                            x={x + barWidth / 2 + 4}
                                            y={MAX_BAR_HEIGHT + 20}
                                            fontSize="12"
                                            fill="gray"
                                            textAnchor="middle"
                                        >
                                            {index === 0 ? '12AM' : index === 12 ? '12PM' : index > 12 ? `${index-12}PM` : `${index}AM`}
                                        </SvgText>
                                    )}
                                </G>
                            );
                        })}
                    </Svg>

                    {/* Tooltip / Info - Positioned relative to scroll view might be tricky. 
                        Let's keep it fixed at top of chart? Or let the parent handle it. 
                        Actually, parent handles the "Filter Chip". 
                        We can remove local tooltip to avoid scrolling issues.
                    */}
                </View>
            </ScrollView>
        </View>
    );
};
