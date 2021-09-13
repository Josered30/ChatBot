import {HStack, IconButton, useTheme, Input, View, Text} from 'native-base';
import React, {useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import makeStyles from '../core/hooks/makeStyles';
import {requestAudioPermission} from '../core/utils/permission';
import {AudioContent, MessageType, TextContent} from '../core/models/message';
import {useAudioRecorder} from '../core/hooks/useAudioRecorder';
import {useAudio} from '../core/redux/audioPlayerContext';
import RNFetchBlob from 'rn-fetch-blob';

interface ChatInputProps {
  sendMessage: (content: TextContent | AudioContent, type: MessageType) => void;
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginHorizontal: 8,
    marginVertical: 5,
    backgroundColor: theme.colors.secondary[500],
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    maxHeight: 100,
    borderColor: theme.colors.secondary[400],
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
  },
  inputFocus: {
    borderColor: theme.colors.secondary[500],
  },
  recordLabel: {
    marginLeft: 15,
    color: 'gray',
  },
}));

function ChatInput(props: ChatInputProps) {
  const theme = useTheme();
  const styles = useStyles();
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const [text, setText] = useState<string>('');
  const [icon, setIcon] = useState<string>('mic');

  const {audioState} = useAudio();
  const {record, onStartRecord, onStopRecord, resetState} = useAudioRecorder(
    audioState.audioRecorderPlayer,
  );

  const [recording, setRecording] = useState(false);
  const recordTime = record.recordTime.substring(0, 5);

  const handleText = async () => {
    if (text) {
      props.sendMessage({text: text}, MessageType.TEXT);
      setText('');
      changeIconAnimation('mic');
    }
    //Keyboard.dismiss();F
  };

  const changeIconAnimation = (newIcon: string) =>
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 50,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setIcon(newIcon);
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 50,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });

  const changeText = async (value: string) => {
    if (value.length === 0 || text.length === 0) {
      const newIcon = icon === 'send' ? 'mic' : 'send';
      changeIconAnimation(newIcon);
    }
    setText(value);
  };

  const handleAudio = async () => {
    const flag = await requestAudioPermission();
    if (!flag) {
      return;
    }

    const path = `${RNFetchBlob.fs.dirs.MainBundleDir}/audio.mp4`;

    if (!recording) {
      changeIconAnimation('send');
      setRecording(true);
      onStartRecord(path);
    } else {
      changeIconAnimation('mic');
      setRecording(false);
      await onStopRecord();

      props.sendMessage(
        {
          path: path,
          duration: record.recordSecs / 1000,
        },
        MessageType.AUDIO,
      );
      resetState();
    }
  };

  const handleButton = () => {
    if (text.length > 0) {
      handleText();
    } else {
      handleAudio();
    }
  };

  return (
    <HStack my={2} px={2}>
      <View style={styles.inputWrapper}>
        {!recording ? (
          <Input
            placeholder="Escriba un mensaje"
            underlineColorAndroid="transparent"
            isFullWidth={true}
            multiline={true}
            onChangeText={changeText}
            value={text}
            paddingY={2}
            variant="unstyled"
          />
        ) : (
          <Text style={styles.recordLabel}>{recordTime}</Text>
        )}
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
