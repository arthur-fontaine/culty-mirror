import type { PropsWithChildren } from "react";
import { createUseStyles } from "../theme/create-use-styles";
import { View } from "react-native";

export const DefaultLayout = (props: PropsWithChildren) => {
  const { styles } = useStyles();

  return <View style={styles.view}>
    {props.children}
  </View>
}

const useStyles = createUseStyles((theme) => ({
  view: {
    backgroundColor: theme.colors.background,
    height: '100%',
    width: '100%',
    paddingHorizontal: theme.spacing.horizontal.screen,
    paddingTop: theme.spacing.vertical.screen,
  },
}))
