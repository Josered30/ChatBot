import {NativeBaseProvider} from 'native-base';
import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {theme} from './styles/theme';
import AppBar from './shared/Appbar';
import ChatInput from './shared/ChatInput';
import {
  AudioContent,
  Message,
  MessageType,
  TextContent,
} from './core/models/message';
import Chat from './shared/Chat';

import {RecognizeTextCommand} from '@aws-sdk/client-lex-runtime-v2';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {AudioPlayerProvider} from './core/redux/audioPlayerContext';
import {lexClient} from './core/services/lexService';
import {getMessageFromSpeech} from './core/services/pollyService';

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

  const botInteraction = async (input: string) => {
    const command = new RecognizeTextCommand({
      text: input,
      botId: 'DBNSQ56OSU',
      botAliasId: 'TSTALIASID',
      localeId: 'en_US',
      sessionId: 'test-session',
    });

    const response = await lexClient.send(command).catch(console.log);
    const responseText = response?.messages?.map((e: any) => e.content);

    // const newData = response?.messages?.map(
    //   (e: any): Message => ({
    //     id: new Date().getTime(),
    //     textContent: {text: e.content},
    //     sender: 'bot',
    //     type: MessageType.TEXT,
    //   }),
    // );

    // if (newData) {
    //   setData((e: Message[]) => [...e, ...newData]);
    // }

    if (responseText) {
      const message = await getMessageFromSpeech(responseText[0]);
      setData((e: Message[]) => [...e, message]);
    }
  };

  const sendMessage = async (
    content: TextContent | AudioContent,
    type: MessageType,
  ) => {
    if (type === MessageType.TEXT) {
      const newMessage: Message = {
        id: new Date().getTime(),
        textContent: content as TextContent,
        sender: 'user',
        type: type,
      };
      setData((e: Message[]) => [...e, newMessage]);
      botInteraction((content as TextContent).text);
    } else {
      const newMessage: Message = {
        id: new Date().getTime(),
        audioContent: content as AudioContent,
        sender: 'user',
        type: type,
      };
      setData((e: Message[]) => [...e, newMessage]);
    }
  };

  return (
    <NativeBaseProvider theme={theme}>
      <AudioPlayerProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background}
        />
        <AppBar />

        <SafeAreaView
          style={{
            backgroundColor: theme.colors.background,
            ...styles.fullHeight,
          }}>
          <Chat data={data} />
          <ChatInput sendMessage={sendMessage} />
        </SafeAreaView>
      </AudioPlayerProvider>
    </NativeBaseProvider>
  );
};

export default App;
