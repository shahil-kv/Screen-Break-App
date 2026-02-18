import React, { useState } from 'react';
import { View, Text, Switch, FlatList, TouchableOpacity } from 'react-native';

const MOCK_APPS = [
  { id: '1', name: 'Instagram', category: 'Social', icon: '📷' },
  { id: '2', name: 'TikTok', category: 'Social', icon: '🎵' },
  { id: '3', name: 'Twitter', category: 'Social', icon: '🐦' },
  { id: '4', name: 'Candy Crush', category: 'Games', icon: '🍬' },
  { id: '5', name: 'YouTube', category: 'Entertainment', icon: '📺' },
];

export const AppSelector = () => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleApp = (id: string) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const filteredApps = activeCategory
    ? MOCK_APPS.filter((app) => app.category === activeCategory)
    : MOCK_APPS;

  const categories = Array.from(new Set(MOCK_APPS.map((a) => a.category)));

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Select Apps to Block</Text>

      <View className="flex-row mb-4 space-x-2">
        <TouchableOpacity
          onPress={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full ${
            activeCategory === null ? 'bg-black' : 'bg-gray-200'
          }`}
        >
          <Text
            className={`${activeCategory === null ? 'text-white' : 'text-black'}`}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              activeCategory === cat ? 'bg-black' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`${activeCategory === cat ? 'text-white' : 'text-black'}`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredApps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center space-x-3">
              <Text className="text-2xl">{item.icon}</Text>
              <View>
                <Text className="text-lg font-medium">{item.name}</Text>
                <Text className="text-gray-500 text-sm">{item.category}</Text>
              </View>
            </View>
            <Switch
              value={selectedApps.includes(item.id)}
              onValueChange={() => toggleApp(item.id)}
              trackColor={{ false: '#e2e2e2', true: '#000' }}
            />
          </View>
        )}
      />
    </View>
  );
};
