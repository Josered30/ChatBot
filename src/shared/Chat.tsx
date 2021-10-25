import {FlatList} from 'native-base';
import React, {useRef, useState} from 'react';
import makeStyles from '../core/hooks/makeStyles';
import useKeyboard from '../core/hooks/useKeyboard';
import {Message} from '../core/models/message';
import MessageItem from './MessageItem';

interface ChatProps {
  data: Message[];
}

const useStyles = makeStyles(_ => ({
  chat: {
    paddingVertical: 5,
    flex: 1,
  },
}));

function Chat(props: ChatProps) {
  const list = useRef<any>(null);

  const flagRef = useRef(false);

  const [offsets, setOffsets] = useState({
    keyboard: 0,
    notKeyboard: 0,
  });

  const styles = useStyles();
  const keyboard = useKeyboard({
    keyboardShow: () => {
      if (flagRef.current) {
        setTimeout(() => list.current.scrollToEnd({animated: false}), 10);
      }
    },
  });

  const handleScroll = (event: any) => {
    if (keyboard) {
      if (event.nativeEvent.contentOffset.y < offsets.keyboard) {
        flagRef.current = false;
      }
      setOffsets({
        keyboard: event.nativeEvent.contentOffset.y,
        notKeyboard: offsets.notKeyboard,
      });
    } else if (!keyboard) {
      if (event.nativeEvent.contentOffset.y < offsets.notKeyboard) {
        flagRef.current = false;
      }
      setOffsets({
        keyboard: offsets.notKeyboard,
        notKeyboard: event.nativeEvent.contentOffset.y,
      });
    }
  };

  return (
    <FlatList
      data={props.data}
      renderItem={({item}: any) => {
        let color: any;
        let position: any;
        if (item.sender === 'user') {
          color = '#97517b';
          position = 'flex-end';
        } else {
          color = '#6E1A8C';
          position = 'flex-start';
        }
        return <MessageItem message={item} color={color} position={position} />;
      }}
      keyExtractor={(item: any) => item.id}
      style={styles.chat}
      ref={list}
      onContentSizeChange={() => list.current.scrollToEnd()}
      onScroll={handleScroll}
      onEndReached={() => (flagRef.current = true)}
      keyboardShouldPersistTaps="always"
    />
  );
}

export default Chat;
