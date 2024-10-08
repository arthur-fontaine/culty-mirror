type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    backgroundElement: ColorString;

    primaryText: ColorString;
    secondaryText: ColorString;
    textInElement: ColorString;

    placeholderText: ColorString;
    placeholderIcon: ColorString;
  };

  // https://wise.design/foundations/spacing#semantic-tokens
  spacing: {
    horizontal: {
      screen: number;
      afterIcon: number;
      betweenElements: number;
    };
    vertical: {
      screen: number;
      groupedElements: number;
      beforeBody: number;
    };
  };

  paddings: {
    medium: number;
  };

  radius: {
    small: number;
    medium: number;
  };

  fontSizes: {
    small: number;
    medium: number;
  };
}
