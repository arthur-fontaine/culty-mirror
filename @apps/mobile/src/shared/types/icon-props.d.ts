import type { StyleProp, ViewStyle } from "react-native";

export interface IconProps {
  filled?: boolean | undefined;
  style: ViewStyle & {
    color: string;
    size: number;
  };
}
