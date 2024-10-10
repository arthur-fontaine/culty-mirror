import type { Theme } from "./theme.d";
import { darkColors } from "./tokens/dark-colors";
import { lightColors } from "./tokens/light-colors";

const base: Omit<Theme[keyof Theme], 'colors'> = {
  paddings: {
    aroundIcon: 12,
    horizontalScreen: 24,
    verticalScreen: 24,
    insideInput: 16,
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
