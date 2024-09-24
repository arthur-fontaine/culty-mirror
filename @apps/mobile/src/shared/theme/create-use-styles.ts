import type { StyleSheet } from 'react-native';
import { useTheme } from './theme-context';
import type { StyleTokens } from './tokens/tokens';

type Style = Parameters<typeof StyleSheet.create>[0];

export const createUseStyles =
  <T extends Style>(getStyles: (tokens: StyleTokens) => T) => {
    return () => {
      const { theme } = useTheme()
      return {
        styles: getStyles(theme),
        theme,
      }
    }
  }
