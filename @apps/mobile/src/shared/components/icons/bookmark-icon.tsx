import * as React from "react"
import Svg, { Path } from "react-native-svg"
import type { IconProps } from "../../types/icon-props"


export const BookmarkIcon = (props: IconProps) => (
  <Svg
    width={props.style.size}
    height={props.style.size}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    {
      props.filled ?
        <Path
          fill={props.style.color}
          d="M3 2.75C3 1.784 3.784 1 4.75 1h6.5c.966 0 1.75.784 1.75 1.75v11.5a.75.75 0 0 1-1.227.579L8 11.722l-3.773 3.107A.75.75 0 0 1 3 14.25z"
        />
        : <Path
          fill={props.style.color}
          d="M3 2.75C3 1.784 3.784 1 4.75 1h6.5c.966 0 1.75.784 1.75 1.75v11.5a.751.751 0 0 1-1.227.579L8 11.722l-3.773 3.107A.751.751 0 0 1 3 14.25V2.75Zm1.75-.25a.25.25 0 0 0-.25.25v9.91l3.023-2.489a.75.75 0 0 1 .954 0l3.023 2.49V2.75a.25.25 0 0 0-.25-.25h-6.5Z"
        />
    }
  </Svg>
)
