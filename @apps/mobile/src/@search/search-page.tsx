import { Text, View } from "react-native";
import { createUseStyles } from "../shared/theme/create-use-styles";

export const SearchPage = () => {
  const { styles } = useStyles();

  return <View
    style={styles.view}
  >
    <Text
      style={styles.text}
    >
      Search Page
    </Text>
  </View>;
};

const useStyles = createUseStyles((theme) => ({
  view: {
    backgroundColor: theme.colors.background,
    height: '100%',
    width: '100%',
  },
  text: {
    color: theme.colors.primaryText,
    fontSize: 24,
  },
}))
