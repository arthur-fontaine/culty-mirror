import type { Theme } from "./theme.d";
import { darkColors } from "./tokens/dark-colors";
import { lightColors } from "./tokens/light-colors";

const base: Omit<Theme[keyof Theme], 'colors'> = {
  spacing: {
    horizontal: {
      screen: 24,
      icon: 12,
      glued: 8,
      insideGroup: 16,
    },
    vertical: {
      screen: 24,
      glued: 4,
      beforeTextBody: 12,
      insideGroup: 24,
      betweenDifferentElements: 48,
    },
  },
  paddings: {
    small: 8,
    medium: 16,
    large: 24,
  },
  radius: {
    small: 8,
    medium: 12,
  },
  fontSizes: {
    small: 10,
    medium: 14,
    large: 24,
  },
};

export const theme: Theme = {
  dark: {
    ...base,
    colors: darkColors,
  },
  light: {
    ...base,
    colors: lightColors,
  },
}
