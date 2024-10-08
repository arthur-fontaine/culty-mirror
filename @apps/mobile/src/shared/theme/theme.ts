import type { Theme } from "./theme.d";
import { darkColors } from "./tokens/dark-colors";
import { lightColors } from "./tokens/light-colors";

const base: Omit<Theme[keyof Theme], 'colors'> = {
  spacing: {
    horizontal: {
      screen: 24,
      afterIcon: 12,
      betweenElements: 16,
    },
    vertical: {
      screen: 24,
      groupedElements: 4,
      beforeBody: 12,
    },
  },
  paddings: {
    medium: 16,
  },
  radius: {
    small: 8,
    medium: 12,
  },
  fontSizes: {
    small: 10,
    medium: 14,
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
