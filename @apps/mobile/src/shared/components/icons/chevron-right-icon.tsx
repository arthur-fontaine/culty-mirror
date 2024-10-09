import * as React from "react"
import Svg, { Path } from "react-native-svg"
import type { IconProps } from "../../types/icon-props"

export const ChevronRightIcon = (props: IconProps) => (
  <Svg
    width={props.style.size}
    height={props.style.size}
    fill="none"
    viewBox="0 0 16 17"
    style={{ width: props.style.size, height: props.style.size, ...props.style }}
  >
    <Path
      fill={props.style.color}
      fillOpacity={0.6}
      d="M6.267 13.833c-.267 0-.534-.133-.667-.266-.4-.4-.4-1.067 0-1.467l3.6-3.6-3.6-3.6c-.4-.4-.4-1.067 0-1.467.4-.4 1.067-.4 1.467 0l4.4 4.267c.4.4.4 1.067 0 1.467l-4.4 4.266c-.267.267-.534.4-.8.4Z"
    />
  </Svg>
)
