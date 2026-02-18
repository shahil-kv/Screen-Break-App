import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutChangeEvent, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Updated for 4 Tabs. 20px padding * 2 = 40px total margin.
const TAB_WIDTH = (SCREEN_WIDTH - 40) / 4; 

export const FluidTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);

  // Update position when tab changes
  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
        damping: 15,
        stiffness: 150,
        mass: 0.5
    });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.container, { bottom: insets.bottom + 4 }]}>
        {/* Background Blur or Dark Layer */}
        <View style={StyleSheet.absoluteFill} className="bg-neutral-900/95 rounded-[35px] border border-white/10" />

        {/* The Fluid Indicator */}
        <Animated.View
            style={[
                styles.indicator,
                animatedStyle,
            ]}
        >
             {/* Inner Glow - Matching the Pill Shape */}
             <View className="flex-1 bg-pink-500/20 rounded-[30px] border border-pink-500" />
        </Animated.View>

        {/* Tab Buttons */}
        <View style={styles.contentContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                let iconName: keyof typeof Ionicons.glyphMap = 'alert';
                // Update icons for 4 tabs
                if (route.name === 'Today') iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
                else if (route.name === 'Blocks') iconName = isFocused ? 'lock-closed' : 'lock-closed-outline';
                else if (route.name === 'Extensions') iconName = isFocused ? 'extension-puzzle' : 'extension-puzzle-outline';
                else if (route.name === 'Settings') iconName = isFocused ? 'options' : 'options-outline';

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={onPress}
                        style={styles.tabButton}
                        activeOpacity={0.8}
                    >
                        <View className="items-center justify-center">
                            <Ionicons 
                                name={iconName} 
                                size={20} 
                                color={isFocused ? "#ec4899" : "#9ca3af"} 
                                style={{ marginBottom: 2 }}
                            />
                            {/* Text Label */}
                            <Animated.Text 
                                className="text-[10px] font-bold"
                                style={{ 
                                    color: isFocused ? "#ec4899" : "#9ca3af",
                                    opacity: isFocused ? 1 : 0.7 
                                }}
                            >
                                {route.name}
                            </Animated.Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 70, // Height is good for visible touch target
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    padding: 6, // Reduced padding to make pill fill more space
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
