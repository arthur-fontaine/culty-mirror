import { Pressable, View } from "react-native"
import { createUseStyles } from "../theme/create-use-styles"
import type { IconProps } from "../types/icon-props"

interface IconButtonProps {
  icon: React.FunctionComponent<IconProps>
  onPress: () => void
}

export const UIIconButton = (props: IconButtonProps) => {
  const { styles } = useStyles()

  return <Pressable onPress={props.onPress}>
    <View style={styles.iconWrapper}>
      <props.icon style={styles.icon} />
    </View>
  </Pressable>
}

const useStyles = createUseStyles(theme => ({
  iconWrapper: {
    padding: theme.paddings.aroundIcon,
    backgroundColor: theme.colors.backgroundSecondaryElement,
    borderRadius: 9999,
  },
  icon: {
    color: theme.colors.primaryText,
    size: 16,
  },
}))
