import type { StyleProp, ViewStyle } from "react-native";

export interface IconProps {
  style: ViewStyle & {
    color: string;
    size: number;
  };
}
