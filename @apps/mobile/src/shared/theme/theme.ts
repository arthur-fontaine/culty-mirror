import type { Theme } from "./theme.d";
import { darkColors } from "./tokens/dark-colors";
import { lightColors } from "./tokens/light-colors";

const base: Omit<Theme[keyof Theme], 'colors'> = {
  paddings: {
    aroundIcon: 12,
    horizontalScreen: 24,
    verticalScreen: 24,
    insideInput: 12,
  },
  radius: {
    small: 8,
    medium: 12,
  },
  fontSizes: {
    info: 12,
    smallBody: 13,
    body: 14,
    smallTitle: 16,
    title: 24,
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
