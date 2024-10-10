type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    primaryElementBackground: ColorString;
    secondaryElementBackground: ColorString;

    primaryText: ColorString;
    secondaryText: ColorString;
    primaryElementText: ColorString;

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
    smallBody: number;
    info: number;
    body: number;
    smallTitle: number;
    title: number;
  };
}
