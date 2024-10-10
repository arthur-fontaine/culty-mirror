import { type Falsy, Pressable, View, type ViewStyle } from "react-native"
import { createUseStyles } from "../theme/create-use-styles"
import type { IconProps } from "../types/icon-props"

interface IconButtonProps {
  icon: React.FunctionComponent<IconProps>
  filled?: boolean
  onPress: () => void
  style?: ViewStyle | Falsy
}

export const UIIconButton = (props: IconButtonProps) => {
  const { styles } = useStyles()

  return <Pressable onPress={props.onPress}>
    <View style={{ ...styles.iconWrapper, ...props.style }}>
      <props.icon style={styles.icon} filled={props.filled} />
    </View>
  </Pressable>
}

const useStyles = createUseStyles(theme => ({
  iconWrapper: {
    padding: theme.paddings.aroundIcon,
    backgroundColor: theme.colors.secondaryElementBackground,
    borderRadius: 9999,
  },
  icon: {
    color: theme.colors.primaryText,
    size: 16,
  },
}))
