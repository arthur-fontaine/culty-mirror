import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { View, type ViewStyle } from "react-native";

export interface SpacerContextType {
  algorithm: (previousValue: number) => number;
  previousValue: number;
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const SpacerContext = createContext<SpacerContextType>(null!);

interface AutoSpacerProps {
  horizontal?: boolean;
  vertical?: boolean;
  style?: ViewStyle;
}

export const UIGroup = (props: React.PropsWithChildren<AutoSpacerProps>) => {
  const spaceValue = useSpaceValue();
  const newSpacerProviderProps = useNewSpacerProviderProps();

  const isVertical = props.vertical ?? !props.horizontal;
  const isHorizontal = props.horizontal ?? !props.vertical;
  const flexDirection = isHorizontal ? "row" : "column";

  return <View style={{
    rowGap: isVertical ? spaceValue : 0,
    columnGap: isHorizontal ? spaceValue : 0,
    flexDirection,
    ...props.style,
  }}>
    <SpacerProvider {...newSpacerProviderProps}>
      {props.children}
    </SpacerProvider>
  </View>;
};

export const Spacer = (props: React.PropsWithChildren<
  | { horizontal: true, vertical?: false | undefined }
  | { horizontal?: false | undefined, vertical: true }
>) => {
  const spaceValue = useSpaceValue();

  return <View style={{
    width: props.horizontal ? spaceValue : 0,
    height: props.vertical ? spaceValue : 0,
  }} />;
}

export const SpacerProvider = (props: React.PropsWithChildren<Omit<SpacerContextType, "previousValue"> & { initialValue: number }>) => {
  return <SpacerContext.Provider value={{ ...props, previousValue: props.initialValue }}>
    {props.children}
  </SpacerContext.Provider>;
}

const useSpaceValue = () => {
  const props = useContext(SpacerContext);
  return useMemo(() => {
    let previousValue = props.previousValue;
    previousValue = props.algorithm(previousValue);
    return previousValue;
  }, [props.algorithm, props.previousValue]);
}

const useNewSpacerProviderProps = () => {
  const props = useContext(SpacerContext);
  return useMemo(() => {
    return {
      algorithm: props.algorithm,
      initialValue: props.algorithm(props.previousValue),
    };
  }, [props.algorithm, props.previousValue]);
};
