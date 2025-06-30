import 'styled-components';
import { defaultTheme } from './styles/themes/default';

// Pega o tipo do nosso objeto de tema para não precisar redeclará-lo
type ThemeType = typeof defaultTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}