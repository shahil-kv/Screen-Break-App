import * as React from 'react';
import * as ReactNative from 'react-native';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions, CameraView } from 'expo-camera';

const MARKETPLACE_URL = 'https://shahil-kv.github.io/Unlink-App-Android-Extensions/marketplace.json';
const BASE_URL = 'https://shahil-kv.github.io/Unlink-App-Android-Extensions';

interface Extension {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  color: string;
  pro: boolean;
  version: string;
  folder: string; // From registry
  bundleUrl?: string; // Derived
}

const RemoteExtension = ({ extensionId, script }: { extensionId: string; script: string }) => {
  const [Component, setComponent] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [debugLog, setDebugLog] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Determine the global var name injected by esbuild
    const globalName = `Extension_${extensionId.replace(/-/g, '_')}`;

    // Clear previous state if extensionId changes
    setComponent(null);
    setError(null);
    
    // A small timeout allows the UI transition animation to finish 
    // before we block the JS thread compiling the remote extension.
    const timer = setTimeout(() => {
      try {
          const ScreenBreak = (globalThis as any).ScreenBreak;

          const flattenedReact: any = { ...React };
          flattenedReact.useState = React.useState;
          flattenedReact.useEffect = React.useEffect;
          flattenedReact.useMemo = React.useMemo;
          flattenedReact.useCallback = React.useCallback;
          flattenedReact.useRef = React.useRef;
          
          const flattenedRN: any = { ...ReactNative };
          
          const customRequire = (name: string) => {
            if (name === 'react') return flattenedReact;
            if (name === 'react-native') return flattenedRN;
            return (globalThis as any)[name];
          };
          
          const logs = [
            `🛡️ SHIELD ACTIVE`,
            `React.useState type: ${typeof flattenedReact.useState}`
          ];

          (globalThis as any).React = flattenedReact;
          (globalThis as any).ReactNative = flattenedRN;

          const executableScript = script + '; return ' + globalName + ';';

          const RemoteComp = new Function('React', 'ReactNative', 'ScreenBreak', 'require', 'global', executableScript)(
            flattenedReact, 
            flattenedRN,
            ScreenBreak,
            customRequire,
            globalThis
          );

          if (RemoteComp) {
              let ActualComponent = RemoteComp;
              if (RemoteComp.default) {
                  ActualComponent = RemoteComp.default;
              } else if (typeof RemoteComp === 'object') {
                  const firstFunction = Object.values(RemoteComp).find(val => typeof val === 'function');
                  if (firstFunction) {
                      ActualComponent = firstFunction;
                  }
              }
              if (typeof ActualComponent !== 'function') {
                throw new Error(`Resolved component is of type ${typeof ActualComponent}, expected function.`);
              }
              
              setDebugLog(logs);
              setComponent(() => ActualComponent);
          } else {
              throw new Error(`Bundle loaded but component ${globalName} not found`);
          }
      } catch (e: any) {
        console.error('❌ Remote Load Error:', e);
        setError(e.toString());
      }
    }, 50); // 50ms delay for UI smoothness

    return () => clearTimeout(timer);
  }, [extensionId, script]);

  if (error) return (
    <View className="p-4 bg-red-50 rounded-xl border border-red-100">
        <Text className="text-red-500 font-bold mb-1">Extension Error</Text>
        <Text className="text-red-400 text-xs mb-3">{error}</Text>
        <View className="bg-black/5 p-2 rounded-lg">
          <Text className="text-xs font-bold text-gray-700 mb-1">Visual Debugger trace:</Text>
          {debugLog.map((log, i) => (
            <Text key={i} className="text-[10px] text-gray-600 font-mono">{log}</Text>
          ))}
        </View>
    </View>
  );
  if (!Component) return (
    <View className="p-8 items-center justify-center">
        <ActivityIndicator color="#ec4899" />
        <Text className="text-gray-400 mt-2 text-xs">Loading Remote Component...</Text>
        <View className="mt-6 w-full bg-gray-100 p-3 rounded-xl border border-gray-200">
          <Text className="text-xs font-bold text-gray-500 mb-1">System Verification Shield:</Text>
          {debugLog.map((log, i) => (
            <Text key={i} className="text-[10px] text-gray-400 font-mono">{log}</Text>
          ))}
        </View>
    </View>
  );

  return <Component />;
};

export const ExtensionsScreen = () => {
  const [extensions, setExtensions] = React.useState<Extension[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'marketplace' | 'installed'>('marketplace');
  const [installedIds, setInstalledIds] = React.useState<string[]>([]);
  const [activeExtension, setActiveExtension] = React.useState<Extension | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = React.useState(false);

  const fetchExtensions = async () => {
    try {
      setLoading(true);
      // Cache busting
      const response = await fetch(`${MARKETPLACE_URL}?t=${Date.now()}`);
      const data = await response.json();
      
      const extensionArray = Array.isArray(data) ? data : data.extensions || [];
      const mapped = extensionArray.map((ext: any) => ({
        ...ext,
        bundleUrl: `${BASE_URL}/bundles/${ext.folder || ext.id}.bundle.js`
      }));
      
      setExtensions(mapped);
    } catch (error) {
      console.error('Error fetching extensions:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchExtensions();
  }, []);

  const handleExtensionClick = async (ext: Extension) => {
    try {
      setLoading(true);
      const bundleUrl = `${BASE_URL}/bundles/${ext.folder || ext.id}.bundle.js?t=${Date.now()}`;
      console.log('📡 Fetching bundle:', bundleUrl);
      
      const response = await fetch(bundleUrl);
      const script = await response.text();
      
      setActiveExtension({ ...ext, bundleUrl: script });
    } catch (error) {
      console.error('Error loading extension bundle:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showScanner) {
    if (!permission) return <View />;
    if (!permission.granted) {
      return (
        <RNSafeAreaView className="flex-1 bg-white items-center justify-center p-6">
          <Text className="text-center text-lg mb-6">We need your permission to show the camera</Text>
          <TouchableOpacity 
            className="bg-pink-500 px-6 py-3 rounded-2xl"
            onPress={requestPermission}
          >
            <Text className="text-white font-bold">Grant Permission</Text>
          </TouchableOpacity>
        </RNSafeAreaView>
      );
    }
    return (
      <View className="flex-1 bg-black">
        <CameraView 
          className="flex-1" 
          onBarcodeScanned={({ data }) => {
            console.log('Scanned:', data);
            setShowScanner(false);
          }}
        />
        <RNSafeAreaView className="absolute top-0 left-0 right-0 p-4">
          <TouchableOpacity 
            className="bg-white/20 w-12 h-12 rounded-full items-center justify-center"
            onPress={() => setShowScanner(false)}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </RNSafeAreaView>
      </View>
    );
  }

  return (
    <RNSafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900 tracking-tight">Extensions</Text>
            <Text className="text-gray-500 text-sm mt-0.5">Customize your focus experience</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full items-center justify-center"
            onPress={() => setShowScanner(true)}
          >
            <Ionicons name="qr-code-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-6 border-b border-gray-200">
          <TouchableOpacity 
            onPress={() => setActiveTab('marketplace')}
            className={`mr-6 pb-2 border-b-2 ${activeTab === 'marketplace' ? 'border-black' : 'border-transparent'}`}
          >
            <Text className={`font-semibold ${activeTab === 'marketplace' ? 'text-black' : 'text-gray-400'}`}>Marketplace</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('installed')}
            className={`pb-2 border-b-2 ${activeTab === 'installed' ? 'border-black' : 'border-transparent'}`}
          >
            <Text className={`font-semibold ${activeTab === 'installed' ? 'text-black' : 'text-gray-400'}`}>Installed</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {activeExtension ? (
          <View className="mb-8 p-4 bg-white rounded-2xl border border-gray-200">
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-4">
                        {activeExtension.iconType === 'Ionicons' ? (
                            <Ionicons name={activeExtension.icon as any} size={24} color="#000" />
                        ) : activeExtension.iconType === 'MaterialCommunityIcons' ? (
                            <MaterialCommunityIcons name={activeExtension.icon as any} size={24} color="#000" />
                        ) : (
                            <FontAwesome5 name={activeExtension.icon as any} size={20} color="#000" />
                        )}
                    </View>
                    <View>
                        <Text className="text-xl font-bold text-black">{activeExtension.title}</Text>
                        <Text className="text-gray-500 text-xs mt-0.5">{activeExtension.description}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setActiveExtension(null)} className="p-2">
                    <Ionicons name="close-circle" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            
            <RemoteExtension extensionId={activeExtension.id} script={activeExtension.bundleUrl!} />
          </View>
        ) : (
          <>
            <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 mb-6 shadow-sm border border-gray-100">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput 
                className="flex-1 ml-3 text-gray-900" 
                placeholder="Search extensions..." 
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View className="mb-8">
              <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {loading ? (
                  <View className="p-12 items-center">
                    <ActivityIndicator color="#000" />
                  </View>
                ) : extensions.length === 0 ? (
                  <View className="p-12 items-center">
                    <Text className="text-gray-400">No extensions found</Text>
                  </View>
                ) : (
                  extensions.map((ext, index) => (
                    <TouchableOpacity 
                      key={ext.id} 
                      onPress={() => handleExtensionClick(ext)}
                      className={`flex-row items-center p-4 ${index !== extensions.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <View className="w-10 h-10 bg-gray-50 rounded-lg items-center justify-center mr-4">
                        {ext.iconType === 'Ionicons' ? (
                          <Ionicons name={ext.icon as any} size={20} color="#000" />
                        ) : ext.iconType === 'MaterialCommunityIcons' ? (
                          <MaterialCommunityIcons name={ext.icon as any} size={20} color="#000" />
                        ) : (
                          <FontAwesome5 name={ext.icon as any} size={16} color="#000" />
                        )}
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="text-base font-bold text-black">{ext.title}</Text>
                          {ext.pro && (
                            <View className="ml-2 bg-black px-1.5 py-0.5 rounded">
                              <Text className="text-[10px] font-bold text-white">PRO</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>{ext.description}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </>
        )}
        <View className="h-24" />
      </ScrollView>
    </RNSafeAreaView>
  );
};
