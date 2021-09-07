import {Text, useTheme, View} from 'native-base';
import React from 'react';
import {ColorValue, FlexAlignType} from 'react-native';
import makeStyles from '../core/hooks/makeStyles';
import {Message} from '../core/models/message';

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
}));

function MessageItem(props: MessageProps) {
  const theme = useTheme();
  const styles = useStyles();

  const color =
    props.color === null ? theme.colors.secondary[500] : props.color;
  const position = props.position === null ? 'center' : props.position;

  const messageStyle =
    props.message.sender === 'bot' ? styles.botMessage : styles.userMessage;

  return (
    <View
      style={{backgroundColor: color, alignSelf: position, ...messageStyle}}>
      <Text>{props.message.text}</Text>
    </View>
  );
}

export default MessageItem;
