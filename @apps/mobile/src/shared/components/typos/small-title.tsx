import { Text } from "react-native";
import { createUseStyles } from "../../theme/create-use-styles";
import type { TypoProps } from "../../types/typo-props";

export const SmallTitle = (props: TypoProps) => {
  const { styles } = useStyles();

  return <Text style={{ ...styles.text, ...props.style }}>
    {props.children}
  </Text>
};

const useStyles = createUseStyles((theme) => ({
  text: {
    fontWeight: 600,
    fontSize: theme.fontSizes.medium,
  },
}));
