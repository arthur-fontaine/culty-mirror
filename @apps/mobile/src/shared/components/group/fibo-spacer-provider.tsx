import { useCallback, useMemo } from "react";
import type React from "react";
import { SpacerProvider } from "./group";

export const FiboSpacerProvider = (props: React.PropsWithChildren<{ startAtNthValue: number }>) => {
  const fiboSuits = useMemo(() => {
    const suits = [1, 1];
    for (let i = 2; i < props.startAtNthValue; i++) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      suits.push(suits[i - 1]! + suits[i - 2]!);
    }
    return suits;
  }, [props.startAtNthValue]);

  const fiboAlgorithm = useCallback((previousValue: number) => {
    return fiboSuits[fiboSuits.indexOf(previousValue) - 1] || 1;
  }, [fiboSuits]);

  return <SpacerProvider
    algorithm={fiboAlgorithm}
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    initialValue={fiboSuits[fiboSuits.length - 1]!}
  >
    {props.children}
  </SpacerProvider>;
};
