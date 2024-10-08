import type { Theme } from "./theme.d";
import { darkColors } from "./tokens/dark-colors";
import { lightColors } from "./tokens/light-colors";

const base: Omit<Theme[keyof Theme], 'colors'> = {
  spacing: {
    horizontal: {
      screen: 24,
      afterIcon: 12,
    },
    vertical: {
      screen: 24,
    },
  },
  paddings: {
    medium: 16,
  },
  radius: {
    medium: 12,
  },
  fontSizes: {
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
