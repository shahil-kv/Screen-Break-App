import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MARKETPLACE_REGISTRY from '../../assets/marketplace.gen.json';
import { GreyscaleFader } from '../../extensions/greyscale-fader/GreyscaleFader';
import * as ScreenBreakSDK from '../../core/sdk';

// Expose SDK globally for remote bundles to access
(global as any).ScreenBreak = ScreenBreakSDK.ScreenBreak;

const EXTENSION_COMPONENTS: Record<string, React.ComponentType> = {
  'greyscale-fader': GreyscaleFader,

};

const BASE_URL = 'https://shahil-kv.github.io/Unlink-App-Android-Extensions';
const MARKETPLACE_URL = `${BASE_URL}/marketplace.json`;

/**
 * RemoteExtension Component
 * Dynamically loads and renders a JS bundle from a URL
 */
const RemoteExtension = ({ bundlePath, extensionId }: { bundlePath: string, extensionId: string }) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadBundle = async () => {
      try {
        const url = `${BASE_URL}/${bundlePath}`;
        console.log(`📡 Fetching bundle: ${url}`);
        const response = await fetch(url);
        const script = await response.text();

        // The bundle is an IIFE that sets a global variable: global.Extension_[id]
        // We inject React, ReactNative, and ScreenBreak into the function scope
        const globalName = `Extension_${extensionId.replace(/-/g, '_')}`;
        const ScreenBreak = (global as any).ScreenBreak;
        
        new Function('React', 'ReactNative', 'ScreenBreak', script)(
          React, 
          require('react-native'),
          ScreenBreak
        );
        
        const RemoteComp = (global as any)[globalName];
        
        if (RemoteComp) {
          // If it's an object with a default export or the component itself
          setComponent(() => RemoteComp.default || RemoteComp);
        } else {
          throw new Error('Bundle loaded but component not found in global scope');
        }
      } catch (err: any) {
        console.error('❌ Remote Load Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBundle();
  }, [bundlePath, extensionId]);

  if (loading) return (
    <View className="p-8 items-center justify-center bg-zinc-900 rounded-3xl border border-zinc-800">
      <View className="w-6 h-6 rounded-full border-2 border-[#ff006e] border-t-transparent animate-spin mb-3" />
      <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Installing Bundle...</Text>
    </View>
  );

  if (error) return (
    <View className="p-6 bg-red-500/10 rounded-3xl border border-red-500/20 items-center">
      <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#ef4444" />
      <Text className="text-red-500 text-xs mt-2 text-center">Failed to load extension: {error}</Text>
    </View>
  );

  return Component ? React.createElement(Component) : null;
};

export const ExtensionsScreen = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [devMode, setDevMode] = React.useState(false);
  const [localUrl, setLocalUrl] = React.useState('');
  const [titleTaps, setTitleTaps] = React.useState(0);
  const [localExtension, setLocalExtension] = React.useState<any>(null);
  const [remoteRegistry, setRemoteRegistry] = React.useState<any[]>([]);
  const [isScannerVisible, setIsScannerVisible] = React.useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const wsRef = React.useRef<WebSocket | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleTitlePress = () => {
    const newTaps = titleTaps + 1;
    if (newTaps >= 3) {
      setDevMode(!devMode);
      setTitleTaps(0);
    } else {
      setTitleTaps(newTaps);
    }
  };

  const loadLocalExtension = async (url?: string) => {
    const targetUrl = url || localUrl;
    try {
      const response = await fetch(`${targetUrl}/extension.json`);
      const manifest = await response.json();
      setLocalExtension({ ...manifest, isLocal: true });
      if (url) setLocalUrl(url);
      setIsScannerVisible(false);
    } catch (err) {
      alert('Failed to load local extension. Check URL and Server.');
    }
  };

  const handleBarcodeScanned = (result: { data: string }) => {
    if (result.data.startsWith('http')) {
      loadLocalExtension(result.data);
    }
  };

  const syncMarketplace = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(MARKETPLACE_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setRemoteRegistry(data);
        console.log('✅ Marketplace synced with', data.length, 'extensions');
      }
    } catch (err) {
      console.log('⚠️ Failed to sync live marketplace, using local cache.');
    } finally {
      setIsSyncing(false);
    }
  };

  React.useEffect(() => {
    syncMarketplace();
  }, []);

  React.useEffect(() => {
    if (!devMode || !localUrl) {
      if (wsRef.current) wsRef.current.close();
      return;
    }

    const wsAddress = localUrl.replace('http://', 'ws://').replace(':8081', ':8082');
    
    try {
      if (wsRef.current) wsRef.current.close();
      
      const ws = new WebSocket(wsAddress);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'reload') {
          console.log('🔄 Live Reload triggered...');
          loadLocalExtension();
        }
      };

      ws.onerror = (e) => console.log('WebSocket Error:', e);
      
      return () => {
        if (wsRef.current) wsRef.current.close();
      };
    } catch (err) {
      console.error('WS Connection failed:', err);
    }
  }, [devMode, localUrl]);

  const filteredExtensions = [
    ...(localExtension ? [localExtension] : []),
    ...(remoteRegistry.length > 0 ? remoteRegistry : MARKETPLACE_REGISTRY)
  ].filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 pt-4 pb-2 border-b border-gray-900">
        <View className="flex-row justify-between items-center mb-1">
          <TouchableOpacity onPress={handleTitlePress} activeOpacity={1}>
            <Text className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Marketplace</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            {isSyncing && (
              <View className="mr-3 flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-[#ff006e] mr-1 animate-pulse" />
                <Text className="text-[#ff006e] text-[10px] font-bold uppercase">Syncing</Text>
              </View>
            )}
            <TouchableOpacity className="bg-[#1c1c1e] p-2 rounded-full">
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-500 mb-2" style={{ fontFamily: 'Outfit_400Regular' }}>Enhance your focus with community builds</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
          {['All', 'Challenges', 'Visuals', 'Utilities', 'Games'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              className={`mr-3 px-5 py-2 rounded-full ${activeCategory === cat ? 'bg-white' : 'bg-[#1c1c1e]'}`}
            >
              <Text className={`font-bold ${activeCategory === cat ? 'text-black' : 'text-gray-400'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        <View className="mb-8">
          {devMode && (
            <View className="mb-6 p-4 bg-zinc-900/80 rounded-3xl border border-zinc-700 border-dashed">
              <Text className="text-white font-bold mb-2">🛠️ Developer Mode</Text>
              <View className="flex-row items-center mb-3">
                <View className="flex-1 bg-black/50 p-3 rounded-xl mr-2">
                  <TextInput 
                    placeholder="http://192.168.x.x:8081" 
                    placeholderTextColor="#444" 
                    className="text-white text-xs"
                    value={localUrl}
                    onChangeText={setLocalUrl}
                  />
                </View>
                <TouchableOpacity onPress={loadLocalExtension as any} className="bg-white px-4 py-3 rounded-xl">
                  <Text className="text-black font-bold text-xs">Load</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => loadLocalExtension()} 
                  className="bg-zinc-800 p-3 rounded-xl ml-2"
                >
                  <Ionicons name="refresh" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={async () => {
                    if (!permission?.granted) {
                      const res = await requestPermission();
                      if (!res.granted) return;
                    }
                    setIsScannerVisible(true);
                  }} 
                  className="bg-zinc-800 p-3 rounded-xl"
                >
                  <Ionicons name="qr-code" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {localExtension && (
                <View className="flex-row items-center mt-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                  <Text className="text-green-500 text-[10px] font-bold uppercase tracking-widest">
                    Linked to {localExtension.title}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit_700Bold' }}>Featured Creators</Text>
            <TouchableOpacity><Text className="text-[#ff006e]">See all</Text></TouchableOpacity>
          </View>
          
          {filteredExtensions.map((item) => (
            <View key={item.id} className="mb-4">
              <TouchableOpacity 
                onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
                className={`bg-[#1c1c1e] rounded-3xl p-4 flex-row items-center border ${selectedId === item.id ? 'border-[#ff006e]' : 'border-gray-800'}`}
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
                    <Text className="text-gray-500 text-xs ml-1 mr-3">New</Text>
                    <Ionicons name="download-outline" size={12} color="#8e8e93" />
                    <Text className="text-gray-500 text-xs ml-1">0</Text>
                    <Text className="text-gray-600 text-xs ml-auto">@{item.author}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              {selectedId === item.id && (
                <View className="mt-2">
                   {EXTENSION_COMPONENTS[item.id] ? (
                     React.createElement(EXTENSION_COMPONENTS[item.id])
                   ) : (
                    <RemoteExtension 
                      bundlePath={item.bundlePath} 
                      extensionId={item.id} 
                    />
                   )}
                </View>
              )}
            </View>
          ))}
        </View>

        <View className="flex-row mb-12">
          {/* Build your own */}
          <View className="flex-1 bg-[#1c1c1e] rounded-3xl p-5 mr-3">
            <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mb-3">
              <MaterialCommunityIcons name="github" size={24} color="white" />
            </View>
            <Text className="text-white text-lg font-bold mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>Build</Text>
            <Text className="text-zinc-500 text-[11px] mb-3">Join our community and build focus habit extensions.</Text>
            <TouchableOpacity className="bg-white/5 py-2.5 rounded-xl items-center border border-zinc-800">
              <Text className="text-white text-xs font-bold">Read Docs</Text>
            </TouchableOpacity>
          </View>

          {/* Import locally */}
          <View className="flex-1 bg-white rounded-3xl p-5">
            <View className="w-10 h-10 rounded-full bg-zinc-100 items-center justify-center mb-3">
              <Ionicons name="qr-code" size={22} color="black" />
            </View>
            <Text className="text-black text-lg font-bold mb-1" style={{ fontFamily: 'Outfit_700Bold' }}>Import</Text>
            <Text className="text-zinc-400 text-[11px] mb-3">Scan your computer to test your local code instantly.</Text>
            <TouchableOpacity 
              onPress={async () => {
                const { granted } = await requestPermission();
                if (granted) setIsScannerVisible(true);
              }}
              className="bg-black py-2.5 rounded-xl items-center"
            >
              <Text className="text-white text-xs font-bold">Scan QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isScannerVisible && (
        <View className="absolute inset-0 z-50 bg-black">
          <CameraView 
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            className="flex-1"
          />
          <SafeAreaView className="absolute top-4 left-6">
            <TouchableOpacity 
              onPress={() => setIsScannerVisible(false)}
              className="bg-black/50 p-3 rounded-full"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
          <View className="absolute bottom-20 left-0 right-0 items-center">
            <View className="bg-black/50 px-6 py-3 rounded-full border border-zinc-700">
              <Text className="text-white font-bold">Scan Terminal QR Code</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
