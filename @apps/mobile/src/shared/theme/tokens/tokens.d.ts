type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    backgroundElement: ColorString;
    backgroundSecondaryElement: ColorString;
    backgroundPressed: ColorString;

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
      icon: number;
      glued: number;
      insideGroup: number;
    };
    vertical: {
      screen: number;
      glued: number;
      insideGroup: number;
      betweenDifferentElements: number;
      beforeTextBody: number;
    };
  };

  paddings: {
    small: number;
    medium: number;
    large: number;
  };

  radius: {
    small: number;
    medium: number;
  };

  fontSizes: {
    small: number;
    medium: number;
    large: number;
  };
}
