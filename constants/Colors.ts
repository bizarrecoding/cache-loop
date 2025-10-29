import { DarkTheme as _DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

const tintColorLight = '#2f95dc';
const tintColorDark = '#ffffff';
const accentColor = tintColorLight;

// UI Theme
export default {
  light: {
    text: '#222222',
    background: '#F2F2F2',
    tint: tintColorLight,
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorLight,
    panel: "#CCCCDD",
    accent: accentColor,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorDark,
    panel: "#333344",
    accent: accentColor,
  },
};

// React Navigation Theme
export const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};
export const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  }, 
};
 
