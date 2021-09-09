import {HStack, IconButton, useTheme, Input, View} from 'native-base';
import React, {useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import makeStyles from '../core/hooks/makeStyles';
import {requestAudioPermission} from '../core/utils/permission';

interface ChatInputProps {
  sendMessage: (text: string) => void;
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginHorizontal: 8,
    marginVertical: 5,
    backgroundColor: theme.colors.secondary[500],
    borderRadius: 100,
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
  const styles = useStyles();
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const [text, setText] = useState('');
  const [icon, setIcon] = useState('mic');

  const handleText = async () => {
    if (text) {
      props.sendMessage(text);
    }
    setText('');
    //Keyboard.dismiss();
  };

  const shrinkAnimation = () =>
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      if (icon === 'send') {
        setIcon('mic');
        growAnimation();
      } else {
        setIcon('send');
        growAnimation();
      }
    });

  const growAnimation = () =>
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

  const changeText = async (value: string) => {
    if (value.length === 0 || text.length === 0) {
      shrinkAnimation();
    }
    setText(value);
  };

  const handleAudio = async () => {
    const flag = await requestAudioPermission();
  };

  const handleButton = () => {
    if (icon === 'send') {
      handleText();
    } else {
      handleAudio();
    }
  };

  return (
    <HStack my={2} px={2}>
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          placeholder="Escriba un mensaje"
          underlineColorAndroid="transparent"
          isFullWidth={true}
          multiline={true}
          _focus={{
            style: styles.inputFocus,
          }}
          onChangeText={changeText}
          value={text}
          paddingY={2}
        />
      </View>

      <IconButton
        style={styles.icon}
        icon={
          <Animated.View
            style={{
              transform: [
                {
                  scaleX: scaleAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
                {
                  scaleY: scaleAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            }}>
            <MaterialIcons name={icon} size={20} />
          </Animated.View>
        }
        variant="unstyled"
        android_ripple={{
          color: theme.colors.secondary[400],
          radius: 20,
        }}
        onPress={handleButton}
      />
    </HStack>
  );
}

export default ChatInput;
