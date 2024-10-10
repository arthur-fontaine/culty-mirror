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

  paddings: {
    aroundIcon: number;
    horizontalScreen: number;
    verticalScreen: number;
    insideInput: number;
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
