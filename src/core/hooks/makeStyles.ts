import {useState} from 'react';
import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};

const makeStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  creator: (theme: Record<string, any>) => T,
) => {
  const useStyles = (theme: Record<string, any>) => {
    const styles = useState(StyleSheet.create(creator(theme)))[0];
    return styles;
  };
  return useStyles;
};

export default makeStyles;
