import {HStack, Text, useTheme} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 10,
  },
});

function AppBar() {
  const theme = useTheme();

  return (
    <HStack
      bg={theme.colors.background}
      px={1}
      py={3}
      justifyContent="center"
      alignItems="center">
      <Text color="white" fontSize={20} fontWeight="bold" style={styles.title}>
        Chatbot
      </Text>
    </HStack>
  );
}

export default AppBar;
