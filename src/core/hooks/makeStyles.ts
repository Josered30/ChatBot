import {useTheme} from 'native-base';
import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};

const makeStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  creator: (theme: Record<string, any>) => T,
) => {
  const useStyles = () => {
    const theme = useTheme();
    const styles = StyleSheet.create(creator(theme));
    return styles;
  };
  return useStyles;
};

export default makeStyles;
