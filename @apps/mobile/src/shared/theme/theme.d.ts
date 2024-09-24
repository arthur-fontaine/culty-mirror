import type { ColorSchemeName } from 'react-native';
import type { StyleTokens } from './tokens/tokens';

export interface Theme extends Record<Extract<ColorSchemeName, string>, StyleTokens> { }
