import {NativeBaseProvider} from 'native-base';
import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {theme} from './styles/theme';
import AppBar from './shared/Appbar';
import ChatInput from './shared/ChatInput';
import {Message} from './core/models/message';
import Chat from './shared/Chat';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import {RecognizeTextCommand} from '@aws-sdk/client-lex-runtime-v2';
import {client} from './core/services/aws';

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

    const response = await client.send(command).catch(console.log);
    const newData = response?.messages?.map(
      (e: any): Message => ({
        id: new Date().getTime(),
        text: e.content,
        sender: 'bot',
      }),
    );

    if (newData) {
      setData((e: Message[]) => [...e, ...newData]);
    }
  };

  const sendMessage = async (message: string) => {
    setData((e: Message[]) => [
      ...e,
      {
        id: new Date().getTime(),
        text: message,
        sender: 'user',
      },
    ]);
    botInteraction(message);
  };

  return (
    <NativeBaseProvider theme={theme}>
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
    </NativeBaseProvider>
  );
};

export default App;
