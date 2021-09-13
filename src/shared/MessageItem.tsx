import {HStack, IconButton, Text, useTheme, View} from 'native-base';
import React, {useRef, useState} from 'react';
import {ColorValue, FlexAlignType} from 'react-native';
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import makeStyles from '../core/hooks/makeStyles';
import {Message, MessageType} from '../core/models/message';

interface MessageProps {
  message: Message;
  color?: ColorValue;
  position?: 'auto' | FlexAlignType;
}

const useStyles = makeStyles(_ => ({
  userMessage: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: 350,
  },
  botMessage: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: 350,
  },
  audioText: {
    fontSize: 12,
    marginHorizontal: 5,
  },
}));

function formatDuration(seconds: number): string {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
}

function MessageItem(props: MessageProps) {
  const theme = useTheme();
  const styles = useStyles();

  const [play, setPlay] = useState(false);

  let sound = useRef<Sound | null>(null);

  const color =
    props.color === null ? theme.colors.secondary[500] : props.color;
  const position = props.position === null ? 'center' : props.position;

  const messageStyle =
    props.message.sender === 'bot' ? styles.botMessage : styles.userMessage;

  const handleAudio = () => {
    if (!play) {
      if (sound.current) {
        sound.current.play(() => {
          setPlay(false);
        });
        setPlay(true);
      } else {
        sound.current = new Sound(
          props.message.audioContent?.path,
          undefined,
          error => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            // loaded successfully
            if (sound.current) {
              sound.current.play(() => {
                setPlay(false);
              });
              setPlay(true);
            }
          },
        );
      }
    } else {
      if (sound.current) {
        sound.current.pause();
        setPlay(false);
      }
    }
  };

  if (props.message.type === MessageType.TEXT) {
    return (
      <View
        style={{backgroundColor: color, alignSelf: position, ...messageStyle}}>
        <Text>{props.message.textContent?.text}</Text>
      </View>
    );
  } else {
    return (
      <View
        style={{backgroundColor: color, alignSelf: position, ...messageStyle}}>
        <HStack alignItems="center">
          <IconButton
            size="sm"
            icon={
              <MaterialIcons name={!play ? 'play-arrow' : 'stop'} size={20} />
            }
            android_ripple={{
              color: theme.colors.secondary[400],
              radius: 15,
            }}
            variant="unstyled"
            onPress={handleAudio}
          />

          <Text style={styles.audioText}>
            {formatDuration(props.message.audioContent?.duration!!)}
          </Text>
        </HStack>
      </View>
    );
  }
}

export default MessageItem;
