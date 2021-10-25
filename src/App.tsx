import {NativeBaseProvider} from 'native-base';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {theme} from './styles/theme';
import AppBar from './shared/Appbar';
import ChatInput from './shared/ChatInput';
import {Message} from './core/models/message';
import Chat from './shared/Chat';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {interactWithBot} from './core/services/lexService';
import {FormatType} from './core/models/enums/formatType';
import KeyboardShift from './shared/KeyboardShift';
import RNAndroidKeyboardAdjust from 'rn-android-keyboard-adjust';

const styles = StyleSheet.create({
  fullHeight: {
    flex: 1,
  },
  chat: {
    paddingVertical: 5,
  },
});

const App = () => {
  const [data, setData] = useState<Message[]>([]);

  useEffect(() => {
    RNAndroidKeyboardAdjust.setAdjustResize();
    RNAndroidKeyboardAdjust.setUnchanged();
  });

  const botInteraction = async (input: string, requestType: FormatType) => {
    const response = await interactWithBot(
      input,
      FormatType.TEXT,
      requestType,
      'sesion',
    );

    if (response) {
      setData((e: Message[]) => [
        ...e,
        {
          id: new Date().getTime(),
          sender: 'bot',
          textContent: response.textOutput[0],
          type: FormatType.TEXT,
        },
      ]);
    }
  };

  const sendMessage = async (content: string, type: FormatType) => {
    if (type === FormatType.TEXT) {
      const newMessage: Message = {
        id: new Date().getTime(),
        textContent: content,
        sender: 'user',
        type: type,
      };
      setData((e: Message[]) => [...e, newMessage]);
      botInteraction(content, FormatType.TEXT);
    } else {
      const newMessage: Message = {
        id: new Date().getTime(),
        audioContent: content,
        sender: 'user',
        type: type,
      };
      setData((e: Message[]) => [...e, newMessage]);
    }
  };

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      <SafeAreaView
        style={{
          backgroundColor: theme.colors.background,
          ...styles.fullHeight,
        }}>
        <AppBar />
        <Chat data={data} />
        <ChatInput sendMessage={sendMessage} />
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default App;
