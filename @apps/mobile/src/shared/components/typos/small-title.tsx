import { Text } from "react-native";
import { createUseStyles } from "../../theme/create-use-styles";
import type { TypoProps } from "../../types/typo-props";

export const UISmallTitle = (props: TypoProps) => {
  const { styles } = useStyles();

  return <Text
    style={{ ...styles.text, ...props.style }}
    numberOfLines={props.numberOfLines}
    ellipsizeMode={props.ellipsizeMode}
  >
    {props.children}
  </Text>
};

const useStyles = createUseStyles((theme) => ({
  text: {
    fontWeight: 600,
    fontSize: theme.fontSizes.smallTitle,
  },
}));
