import type { Theme } from "./theme.d";
import { darkColors } from "./tokens/dark-colors";
import { lightColors } from "./tokens/light-colors";

const base: Omit<Theme[keyof Theme], 'colors'> = {
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
