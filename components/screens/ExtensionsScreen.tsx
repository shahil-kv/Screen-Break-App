import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const EXTENSIONS = [
  {
    id: '1',
    title: 'DuoLingo Gate',
    author: 'duo_fan',
    description: 'Solve 3 language puzzles to unlock Social apps.',
    icon: 'language',
    iconType: 'Ionicons',
    color: '#58cc02',
    downloads: '1.2k',
    rating: '4.9',
    pro: true
  },
  {
    id: '2',
    title: 'Greyscale Fader',
    author: 'design_pro',
    description: 'Screen slowly fades to B&W as you hit limits.',
    icon: 'invert-colors',
    iconType: 'MaterialCommunityIcons',
    color: '#8e8e93',
    downloads: '850',
    rating: '4.7',
    pro: false
  },
  {
    id: '3',
    title: 'Charity Fine',
    author: 'impact_labs',
    description: 'Donate $0.50 to charity for every 10m over-limit.',
    icon: 'heart',
    iconType: 'Ionicons',
    color: '#ff2d55',
    downloads: '420',
    rating: '4.8',
    pro: true
  },
  {
    id: '4',
    title: 'NFC Physical Key',
    author: 'hardware_nut',
    description: 'Scan an NFC tag to unlock focus-blocked apps.',
    icon: 'nfc',
    iconType: 'MaterialCommunityIcons',
    color: '#5856d6',
    downloads: '310',
    rating: '4.6',
    pro: true
  },
  {
    id: '5',
    title: 'Focus Pet',
    author: 'game_dev_joe',
    description: 'Keep your virtual pet happy by staying focused.',
    icon: 'dog',
    iconType: 'FontAwesome5',
    color: '#ff9500',
    downloads: '2.5k',
    rating: '5.0',
    pro: false
  }
];

export const ExtensionsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 pt-4 pb-2 border-b border-gray-900">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Marketplace</Text>
          <TouchableOpacity className="bg-[#1c1c1e] p-2 rounded-full">
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 mb-2" style={{ fontFamily: 'Outfit_400Regular' }}>Enhance your focus with community builds</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
          {['All', 'Challenges', 'Visuals', 'Utilities', 'Games'].map((cat, i) => (
            <TouchableOpacity 
              key={cat} 
              className={`mr-3 px-5 py-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-[#1c1c1e]'}`}
            >
              <Text className={`font-bold ${i === 0 ? 'text-black' : 'text-gray-400'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Featured Creators</Text>
            <TouchableOpacity><Text className="text-[#ff006e]">See all</Text></TouchableOpacity>
          </View>
          
          {EXTENSIONS.map((item) => (
            <TouchableOpacity 
              key={item.id}
              className="bg-[#1c1c1e] rounded-3xl p-4 mb-4 flex-row items-center border border-gray-800"
            >
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: `${item.color}20` }}
              >
                {item.iconType === 'Ionicons' && <Ionicons name={item.icon as any} size={32} color={item.color} />}
                {item.iconType === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} />}
                {item.iconType === 'FontAwesome5' && <FontAwesome5 name={item.icon as any} size={30} color={item.color} />}
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Outfit_700Bold' }}>{item.title}</Text>
                  {item.pro && (
                    <View className="bg-[#ff006e]/20 px-2 py-0.5 rounded-md border border-[#ff006e]/30">
                      <Text className="text-[#ff006e] text-[10px] font-bold">PRO</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>{item.description}</Text>
                
                <View className="flex-row items-center mt-2">
                  <Ionicons name="star" size={12} color="#ffcc00" />
                  <Text className="text-gray-500 text-xs ml-1 mr-3">{item.rating}</Text>
                  <Ionicons name="download-outline" size={12} color="#8e8e93" />
                  <Text className="text-gray-500 text-xs ml-1">{item.downloads}</Text>
                  <Text className="text-gray-600 text-xs ml-auto">by @{item.author}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-[#ff006e] rounded-3xl p-6 mb-12 flex-row items-center">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>Build your own</Text>
            <Text className="text-white/80 text-sm">Join our GitHub community and build custom extensions.</Text>
            <TouchableOpacity className="bg-white px-5 py-2 rounded-full self-start mt-4">
              <Text className="text-black font-bold">Read Docs</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons name="github" size={60} color="white" style={{ opacity: 0.3 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
