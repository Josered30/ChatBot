import Sound from 'react-native-sound';
import RNFetchBlob from 'rn-fetch-blob';
import {Message, MessageType} from '../models/message';
import {api} from '../utils/api';

function getDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const sound: Sound = new Sound(url, undefined, error => {
      if (error) {
        console.log('failed to load the sound', error);
        reject(error);
        return;
      }
      // loaded successfully
      if (sound) {
        console.log('duration in seconds: ' + sound.getDuration());
        resolve(sound.getDuration());
      }
    });
  });
}

export async function getMessageFromSpeech(value: string): Promise<Message> {
  const date = new Date().getTime();
  const url = `${RNFetchBlob.fs.dirs.MainBundleDir}/${date.toString()}_bot.mp3`;

  try {
    await RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      appendExt: 'mp3',
      path: url,
    }).fetch(
      'POST',
      `${api}/api/polly`,
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({text: value}),
    );

    const duration = await getDuration(url);
    const newData: Message = {
      id: date,
      audioContent: {
        path: url,
        duration: duration,
      },
      sender: 'bot',
      type: MessageType.AUDIO,
    };
    return newData;
  } catch (e) {
    console.log('polly service: ', e);

    const newData: Message = {
      id: date,
      textContent: {
        text: 'Error',
      },
      sender: 'bot',
      type: MessageType.TEXT,
    };
    return newData;
  }
}
