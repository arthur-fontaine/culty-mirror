import * as React from "react"
import Svg, { Path } from "react-native-svg"
import type { IconProps } from "../../types/icon-props"

export const CheckIcon = (props: IconProps) => (
  <Svg
    width={props.style.size}
    height={props.style.size}
    fill="none"
    viewBox="0 0 16 17"
    {...props}
  >
    <Path
      fill={props.style.color}
      d="M13.78 5.108a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 0 1 1.06-1.06L6 11.828l6.72-6.72a.75.75 0 0 1 1.06 0Z"
    />
  </Svg>
)
