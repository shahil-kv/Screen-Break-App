import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, interpolateColor, withSpring, interpolate, Extrapolation, withDelay } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface ScreenTimeGoalStepProps {
  onNext: () => void;
  screenTimeGoal: number;
  setScreenTimeGoal: (hours: number) => void;
}

export const ScreenTimeGoalStep: React.FC<ScreenTimeGoalStepProps> = ({ onNext, screenTimeGoal, setScreenTimeGoal }) => {
    const MAX_HOURS = 12;
    // Shared values
    const progress = useSharedValue(0); 
    const isPressed = useSharedValue(false);
    const context = useSharedValue(0); 
    const sliderHeight = useSharedValue(400); // Default to reasonable height

    useEffect(() => {
        const targetProgress = Math.min(1, Math.max(0, screenTimeGoal / MAX_HOURS));
        if (Math.abs(progress.value - targetProgress) > 0.01) {
             progress.value = withSpring(targetProgress, { damping: 20, stiffness: 100 });
        }
    }, [screenTimeGoal]);

    const triggerHapticIfNeeded = (hours: number) => {
        if (hours !== screenTimeGoal && hours >= 0 && hours <= MAX_HOURS) {
            setScreenTimeGoal(hours);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }; 

    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = true;
            context.value = progress.value;
        })
        .onUpdate((e) => {
            const height = sliderHeight.value || 400; // robust default
            const sensitivity = 1 / height;
            
            // Dragging up (negative Y) increases progress
            let newProgress = context.value - (e.translationY * sensitivity);
            newProgress = Math.max(0, Math.min(1, newProgress));
            
            progress.value = newProgress;
            
            const hours = Math.round(progress.value * MAX_HOURS);
            runOnJS(triggerHapticIfNeeded)(hours);
        })
        .onFinalize(() => {
            isPressed.value = false;
        });

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: 1 }
            ]
        };
    });

    const fillAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: `${progress.value * 100}%`,
            backgroundColor: interpolateColor(
                progress.value,
                [0, 0.4, 0.8], 
                ['#a3e635', '#fde047', '#ff453a'] 
            ),
        };
    });

    const eyesContainerStyle = useAnimatedStyle(() => {
        // Eyes fade in quickly and move up slightly
        return {
            opacity: interpolate(progress.value, [0, 0.05], [0, 1], Extrapolation.CLAMP),
            transform: [
                { translateY: interpolate(progress.value, [0, 0.1], [20, 0], Extrapolation.CLAMP) }
            ]
        };
    });

    return (
        <View className="flex-1 items-center justify-between py-6 px-6">
            <View className="w-full flex-1">
                 <Text className="text-2xl mb-6 font-bold text-center text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                    Set your ideal daily{"\n"}screen time
                </Text>
                
                <View className="flex-row items-center justify-center space-x-2 mb-4">
                    <Text className="text-4xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>
                        🏁 {Math.round(screenTimeGoal) === 0 ? "0 seconds" : `${screenTimeGoal} hours`}
                    </Text>
                </View>

                {/* Vertical Slider - Layout Fixed */}
                <GestureHandlerRootView className="flex-1 w-full mb-4">
                    <GestureDetector gesture={gesture}>
                        <Animated.View 
                            className="w-full h-full bg-[#1c1c1e] rounded-[44px] overflow-hidden relative border-2 border-white"
                            style={containerAnimatedStyle}
                            onLayout={(event) => {
                                const { height } = event.nativeEvent.layout;
                                if (height > 0) {
                                    sliderHeight.value = height;
                                }
                            }}
                        >
                             <View className="flex-1 w-full justify-end">
                                 {/* Filled part */}
                                 <Animated.View style={[fillAnimatedStyle, { width: '100%', borderBottomLeftRadius: 44, borderBottomRightRadius: 44 }]}>
                                    
                                    {/* Eyes Container - absolute inside the filled view, anchored to top */}
                                    <Animated.View style={[eyesContainerStyle, { position: 'absolute', top: 24, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 48 }]}>
                                         
                                         {/* Left Eye */}
                                        <View className="w-16 h-10 bg-white rounded-full overflow-hidden relative">
                                             {/* Pupil looking right */}
                                             <View className="absolute right-2 top-1 w-10 h-10 bg-black rounded-full" />
                                        </View>

                                        {/* Right Eye */}
                                        <View className="w-16 h-10 bg-white rounded-full overflow-hidden relative">
                                             {/* Pupil looking left/center */}
                                             <View className="absolute left-2 top-1 w-10 h-10 bg-black rounded-full" />
                                        </View>

                                    </Animated.View>

                                 </Animated.View>
                            </View>
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>

            <View className="w-full mt-10">
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
