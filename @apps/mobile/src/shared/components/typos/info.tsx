import { Text } from "react-native";
import type { TypoProps } from "../../types/typo-props";
import { createUseStyles } from "../../theme/create-use-styles";

export const Info = (props: TypoProps) => {
  const { styles } = useStyles();

  return <Text style={{ ...styles.text, ...props.style }}>
    {props.children}
  </Text>;
};

const useStyles = createUseStyles((theme) => ({
  text: {
    fontWeight: 500,
    fontSize: theme.fontSizes.small,
  },
}));
