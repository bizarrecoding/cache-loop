import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { memo, StrictMode, useEffect } from 'react';
import 'react-native-reanimated';

import { ApolloGQLProvider } from '@/client/client';
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, LightTheme } from '@/constants/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
 
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StrictMode>
      <ApolloGQLProvider >  
          <RootLayoutNav /> 
      </ApolloGQLProvider>
    </StrictMode>
  );
}

const RootLayoutNav = memo(() => {
  const colorScheme = useColorScheme(); 
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>      
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
})

RootLayoutNav.displayName = 'RootLayoutNav';
