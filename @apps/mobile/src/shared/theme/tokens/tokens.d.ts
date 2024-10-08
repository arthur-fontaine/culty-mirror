type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    backgroundElement: ColorString;

    primaryText: ColorString;
    textInElement: ColorString;

    placeholderText: ColorString;
    placeholderIcon: ColorString;
  };

  // https://wise.design/foundations/spacing#semantic-tokens
  spacing: {
    horizontal: {
      screen: number;
      afterIcon: number;
    };
    vertical: {
      screen: number;
    };
  };

  paddings: {
    medium: number;
  };

  radius: {
    medium: number;
  };

  fontSizes: {
    medium: number;
  };
}
