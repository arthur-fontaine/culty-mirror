import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import type React from 'react';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FiboSpacerProvider } from '../shared/components/group/fibo-spacer-provider';
import { ThemeProvider, useTheme } from '../shared/theme/theme-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <FiboSpacerProvider startAtNthValue={9}>
          <WaitLoading>
            <Slot />
          </WaitLoading>
        </FiboSpacerProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const WaitLoading = ({ children }: React.PropsWithChildren) => {
  const [fontsLoaded] = useFonts({});
  const { colorScheme } = useTheme();

  const loaded = true
    && fontsLoaded
    && colorScheme !== undefined;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <>{children}</>;
}
