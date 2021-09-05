import {HStack, IconButton, useTheme, Input, View} from 'native-base';
import React, {useState} from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import makeStyles from '../core/hooks/makeStyles';

interface ChatInputProps {
  sendMessage: (text: string) => void;
}

const useStyles = makeStyles(theme => ({
  icon: {
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flex: 1,
    maxHeight: 100,
  },
  input: {
    borderColor: theme.colors.secondary[400],
  },
  inputFocus: {
    borderColor: theme.colors.secondary[500],
  },
}));

function ChatInput(props: ChatInputProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [text, setText] = useState('');

  const handleText = async () => {
    if (text) {
      props.sendMessage(text);
    }
    setText('');
    //Keyboard.dismiss();
  };

  return (
    <HStack my={2}>
      <View mx={2} style={styles.inputWrapper}>
        <Input
          style={styles.input}
          placeholder="Escriba un mensaje"
          underlineColorAndroid="transparent"
          isFullWidth={true}
          multiline={true}
          _focus={{
            style: styles.inputFocus,
          }}
          onChangeText={setText}
          value={text}
          paddingY={2}
        />
      </View>

      <IconButton
        icon={
          <MaterialIcons
            name="send"
            size={20}
            color={theme.colors.secondary[500]}
            style={styles.icon}
          />
        }
        variant="unstyled"
        android_ripple={{
          color: theme.colors.secondary[400],
          radius: 20,
        }}
        onPress={handleText}
      />
    </HStack>
  );
}

export default ChatInput;
