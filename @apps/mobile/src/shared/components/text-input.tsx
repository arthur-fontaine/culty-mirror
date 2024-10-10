import type React from "react";
import { useCallback, useRef } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native"
import { createUseStyles } from "../theme/create-use-styles";
import type { IconProps } from "../types/icon-props";

interface UITextInputProps extends Pick<TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
> {
  icon?: React.FunctionComponent<IconProps>;
}

export const UITextInput = (props: UITextInputProps) => {
  const { styles } = useStyles();

  const textInputRef = useRef<TextInput | null>(null)

  const onWrapperClick = useCallback(() => {
    textInputRef.current?.focus()
  }, [])

  return <Pressable onPress={onWrapperClick}>
    <View style={styles.wrapper}>
      {props.icon !== undefined && <props.icon style={styles.icon} />}
      <TextInput
        ref={textInputRef}
        style={styles.textInput}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholderTextColor={styles.textInput.placeholderColor}
      />
    </View>
  </Pressable>
}

const useStyles = createUseStyles((theme) => ({
  wrapper: {
    cursor: 'text' as never,
    backgroundColor: theme.colors.backgroundElement,
    borderRadius: theme.radius.medium,
    padding: theme.paddings.insideInput,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: theme.colors.placeholderIcon,
    size: 24,
    marginRight: theme.paddings.aroundIcon,
  },
  textInput: {
    color: theme.colors.textInElement,
    placeholderColor: theme.colors.placeholderIcon,
    fontSize: theme.fontSizes.medium,
    fontWeight: 600,
    outlineStyle: 'none',
    height: '100%',
    flex: 1,
  },
}))
