import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface HowItHelpsStepProps {
  onNext: () => void;
}

export const HowItHelpsStep: React.FC<HowItHelpsStepProps> = ({ onNext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const CARD_WIDTH = width - 48;

  const slides = [
    {
      title: "Build focus on your terms",
      description: "Create flexible schedules that match the way you actually live and work.",
      icon: <MaterialCommunityIcons name="history" size={48} color="#ff006e" />,
      useCases: [
        {
          label: "Weekday deep work",
          text: "Mute short-video and social apps from 9:00-11:30 so that a quick check-in doesn't swallow your morning."
        },
        {
          label: "Hourly safeguards",
          text: "Set an hourly budget that limits entertainment apps to 20 minutes so news binges still leave room for your next meeting."
        }
      ]
    },
    {
      title: "Know where your time goes",
      description: "See the patterns that spark better habits: most-used apps, streaks, and trouble hours.",
      icon: <MaterialIcons name="bar-chart" size={48} color="#ff006e" />,
      useCases: [
        {
          label: "Peak temptation hours",
          text: "Spot that 8:00-10:00 p.m. is your scroll zone and see which apps keep pulling you back so you can set smarter limits."
        },
        {
          label: "Sunday reset",
          text: "Review weekly reports to decide which apps to cap next and celebrate your reclaimed hours."
        }
      ]
    },
    {
      title: "Break the autopilot scroll",
      description: "ScreenBreak's Focus Challenge adds a playful pause before distractions.",
      icon: <Ionicons name="game-controller" size={48} color="#ff006e" />,
      useCases: [
        {
          label: "Before opening TikTok",
          text: "Solve a 30-second mini game to remind yourself you meant to text your friend back, not dive into endless videos."
        },
        {
          label: "Weekend coffee line",
          text: "Use the challenge as a breathing break so you return to your book instead of doomscrolling while waiting."
        }
      ]
    }
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1 bg-black pt-6 pb-6">
      <View className="items-center w-full px-6 mb-8">
        {/* Sparkle/Eyes Illustration */}
        <View className="flex-row space-x-8 mb-6">
          <View className="w-20 h-10 bg-gray-600 rounded-t-full overflow-hidden relative">
            <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
          </View>
          <View className="w-20 h-10 bg-gray-600 rounded-t-full overflow-hidden relative items-center justify-center">
             <View className="absolute inset-x-2 top-2 bottom-0 bg-black rounded-t-full" />
             <MaterialCommunityIcons name="star-four-points" size={24} color="#facc15" style={{ position: 'absolute', right: -10, top: -5 }} />
          </View>
        </View>

        <Text className="text-4xl font-bold text-center text-white mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
          How ScreenBreak helps
        </Text>
        <Text className="text-lg text-gray-500 text-center" style={{ fontFamily: 'Outfit_400Regular' }}>
          See how ScreenBreak fits into everyday routines and keeps you focused.
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
          {slides.map((slide, index) => (
            <View key={index} style={{ width }} className="px-6">
              <View className="bg-[#1c1c1e] rounded-3xl p-8 flex-1">
                <View className="flex-row items-center mb-6">
                  <View className="mr-4">
                    {slide.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>
                      {slide.title}
                    </Text>
                    <Text className="text-gray-400 text-sm leading-5" style={{ fontFamily: 'Outfit_400Regular' }}>
                      {slide.description}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-500 font-bold mb-4 uppercase text-xs tracking-widest" style={{ fontFamily: 'Outfit_700Bold' }}>
                  Use cases
                </Text>

                <View className="space-y-4 flex-1">
                  {slide.useCases.map((uc, i) => (
                    <View key={i} className="bg-[#2c2c2e] rounded-2xl p-5 mb-4 shadow-sm">
                      <Text className="text-white text-lg font-bold mb-2" style={{ fontFamily: 'Outfit_700Bold' }}>
                        {uc.label}
                      </Text>
                      <Text className="text-gray-400 text-sm leading-5" style={{ fontFamily: 'Outfit_400Regular' }}>
                        {uc.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Pager Dots Inside Card */}
                <View className="flex-row justify-center space-x-2 mt-4">
                  {slides.map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      className={`w-2.5 h-2.5 rounded-full ${activeIndex === dotIndex ? 'bg-white' : 'bg-gray-700'}`}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="px-6 mt-6">
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
