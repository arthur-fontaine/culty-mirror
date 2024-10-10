import type { PropsWithChildren } from "react";
import { ScrollView } from "react-native";
import { createUseStyles } from "../theme/create-use-styles";

export const DefaultLayout = (props: PropsWithChildren) => {
  const { styles } = useStyles();

  return <ScrollView style={styles.view}>
    {props.children}
  </ScrollView>;
}

const useStyles = createUseStyles((theme) => ({
  view: {
    backgroundColor: theme.colors.background,
    height: '100%',
    width: '100%',
    paddingHorizontal: theme.paddings.horizontalScreen,
    paddingTop: theme.paddings.verticalScreen,
    paddingBottom: theme.paddings.verticalScreen * 2,
  },
}))
