import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlockingProvider } from './context/BlockingContext';
import { BreakOverlay } from './components/blocking/BreakOverlay';
import { HomeScreen } from './components/screens/HomeScreen';
import { BlocksScreen } from './components/screens/BlocksScreen';
import { ExtensionsScreen } from './components/screens/ExtensionsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { FluidTabBar } from './components/navigation/FluidTabBar';
import './global.css';

// Build 0.81.5 has fixed safeAreaView but dependencies might still use it
LogBox.ignoreLogs([/SafeAreaView has been deprecated/]);

const Tab = createBottomTabNavigator();

// ...

function TabNavigator() {
  return (
    <Tab.Navigator
        tabBar={props => <FluidTabBar {...props} />}
        screenOptions={{
            headerShown: false,
            // Hide default background since our custom bar handles it
            tabBarStyle: { position: 'absolute' }, 
        }}
    >
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="Blocks" component={BlocksScreen} />
      <Tab.Screen name="Extensions" component={ExtensionsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BlockingProvider>
        <NavigationContainer>
           <TabNavigator />
           <BreakOverlay />
        </NavigationContainer>
        <StatusBar style="light" />
      </BlockingProvider>
    </SafeAreaProvider>
  );
}