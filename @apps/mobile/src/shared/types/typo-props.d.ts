import type React from "react";
import type { TextProps, TextStyle } from "react-native";

export interface TypoProps extends React.PropsWithChildren<
  & { style?: TextStyle }
  & Pick<TextProps, "numberOfLines" | "ellipsizeMode">
> { }
