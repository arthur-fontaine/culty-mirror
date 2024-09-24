import { type PropsWithChildren, createContext, useContext } from 'react';
import { type ColorSchemeName, useColorScheme } from 'react-native';

import { theme as defaultTheme } from './theme';
import type { Theme } from './theme.d';
import type { StyleTokens } from './tokens/tokens';

interface ThemeContextValue {
  theme: StyleTokens;
  colorScheme?: ColorSchemeName;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: {} as StyleTokens,
});

interface ThemeProviderProps {
  colorScheme?: ColorSchemeName;
  theme?: Theme
}

export const ThemeProvider = (props: PropsWithChildren<ThemeProviderProps>) => {
  const nativeColorScheme = useColorScheme();
  const {
    colorScheme = nativeColorScheme,
    children,
    theme = defaultTheme,
  } = props;

  return (
    <ThemeContext.Provider value={{
      theme: theme[colorScheme ?? 'light'],
      colorScheme: nativeColorScheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
