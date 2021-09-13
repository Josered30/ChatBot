import RNFetchBlob from 'rn-fetch-blob';
import {Message, MessageType} from '../models/message';
import {api} from '../utils/api';

export async function getMessageFromSpeech(value: string): Promise<Message> {
  const date = new Date();
  const url = `${
    RNFetchBlob.fs.dirs.MainBundleDir
  }/${date.toDateString()}_bot.mp3`;

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
  } catch (e) {
    console.log(e);
  }

  const newData: Message = {
    id: date.getTime(),
    audioContent: {
      path: url,
    },
    sender: 'bot',
    type: MessageType.AUDIO,
  };

  console.log(newData);
  return newData;
}
