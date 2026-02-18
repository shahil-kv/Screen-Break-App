import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlocking } from '../../context/BlockingContext';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
    const { isStrict, setStrict } = useBlocking();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Pro Banner */}
        <View className="bg-green-100 rounded-2xl p-6 mt-6 mb-8 border border-green-200">
            <Text className="text-green-800 font-bold text-lg mb-1">Unlock Pro</Text>
            <Text className="text-green-700 mb-4">Less Distractions, More Focus.</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
                <View className="bg-white/50 px-2 py-1 rounded">
                    <Text className="text-green-800 text-xs font-bold">LIFETIME</Text>
                </View>
                <View className="bg-white/50 px-2 py-1 rounded">
                    <Text className="text-green-800 text-xs font-bold">{'>'} 50% OFF</Text>
                </View>
            </View>
            <TouchableOpacity className="bg-red-500 py-3 rounded-xl items-center">
                <Text className="text-white font-bold">Claim Free Membership</Text>
            </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View className="flex-row space-x-4 mb-6">
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Journey</Text>
                <Text className="text-3xl font-bold">12</Text>
                <Text className="text-gray-500 text-xs">Days Active</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Mindfulness</Text>
                <Text className="text-3xl font-bold">84</Text>
                <Text className="text-gray-500 text-xs">Breaks Taken</Text>
            </View>
        </View>

        {/* Weekly Report Banner */}
        <TouchableOpacity className="bg-yellow-100 p-4 rounded-xl mb-8 flex-row justify-between items-center border border-yellow-200">
            <View>
                <Text className="text-yellow-800 font-bold text-lg">Weekly Report</Text>
                <Text className="text-yellow-700">Check your usage analysis</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#854d0e" />
        </TouchableOpacity>

        {/* General Settings */}
        <Text className="text-lg font-bold mb-4 ml-1">General</Text>
        
        <View className="bg-white rounded-xl overflow-hidden mb-8">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Text className="text-base">Strict Mode</Text>
                <Switch 
                    value={isStrict}
                    onValueChange={setStrict}
                    trackColor={{ false: '#e2e2e2', true: '#000' }}
                />
            </View>
             <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Text className="text-base">Customize Block Screen</Text>
                <Text className="text-gray-400">{'>'}</Text>
            </TouchableOpacity>
             <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Text className="text-base">Rule Edit Cooldown</Text>
                <Switch value={false} trackColor={{ false: '#e2e2e2', true: '#000' }} />
            </View>
             <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Text className="text-base">Exclude from Screen Time</Text>
                <Text className="text-gray-400">{'>'}</Text>
            </TouchableOpacity>
             <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Text className="text-base">App Icon</Text>
                <View className="w-8 h-8 bg-black rounded-lg" />
            </TouchableOpacity>
             <TouchableOpacity className="flex-row items-center justify-between p-4">
                <Text className="text-base">Language</Text>
                <Text className="text-gray-500">English</Text>
            </TouchableOpacity>
        </View>

        {/* Support */}
        <Text className="text-lg font-bold mb-4 ml-1">Support</Text>
        <View className="bg-white rounded-xl overflow-hidden mb-8">
             <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
                <Text className="text-base">Refresh Block Rules</Text>
            </TouchableOpacity>
             <TouchableOpacity className="flex-row items-center justify-between p-4">
                <Text className="text-base">Contact Support</Text>
            </TouchableOpacity>
        </View>

        <Text className="text-gray-400 text-center text-xs mb-8">Version 1.0.0 (Build 42)</Text>

      </ScrollView>
    </SafeAreaView>
  );
};
