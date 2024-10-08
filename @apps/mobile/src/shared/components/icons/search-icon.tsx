import * as React from "react"
import Svg, { Path } from "react-native-svg"
import type { IconProps } from "../../types/icon-props"

export const SearchIcon = (props: IconProps) => (
  <Svg
    width={props.style.size}
    height={props.style.size}
    viewBox="0 0 16 17"
    fill="none"
    style={{ width: props.style.size, height: props.style.size, ...props.style }}
  >
    <Path
      fill={props.style.color}
      d="M10.68 12.24a6 6 0 1 1 1.06-1.06l3.04 3.04a.749.749 0 0 1-.722 1.268.75.75 0 0 1-.338-.208l-3.04-3.04Zm.82-4.74a4.5 4.5 0 1 0-9-.134 4.5 4.5 0 0 0 9 .134Z"
    />
  </Svg>
)
