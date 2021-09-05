import {extendTheme} from 'native-base';

export const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: '#e1e1e1',
      100: '#b5b4b4',
      200: '#838383',
      300: '#515151',
      400: '#2c2b2b',
      500: '#070606',
      600: '#060505',
      700: '#050404',
      800: '#040303',
      900: '#020202',
    },
    secondary: {
      50: '#f3eaef',
      100: '#e0cbd7',
      200: '#cba8bd',
      300: '#b685a3',
      400: '#a76b8f',
      500: '#97517b',
      600: '#8f4a73',
      700: '#844068',
      800: '#7a375e',
      900: '#69274b',
    },
    background: '#070606',
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'dark',
  },
});
