type ColorString = `#${string}`;

export interface StyleTokens {
  colors: {
    background: ColorString;
    primaryText: ColorString;
  };
}
