import Sound from 'react-native-sound';
import RNFetchBlob from 'rn-fetch-blob';

const api = 'https://polly-test.herokuapp.com/api';

export function getDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const sound: Sound = new Sound(url, undefined, error => {
      if (error) {
        console.log('failed to load the sound', error);
        reject(error);
        return;
      }
      // loaded successfully
      if (sound) {
        resolve(sound.getDuration());
      }
    });
  });
}

export async function getMessageFromSpeech(value: string): Promise<string> {
  const date = new Date().getTime();
  const url = `${RNFetchBlob.fs.dirs.MainBundleDir}/audio_bot_${date}.mp3`;
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
    // const duration = await getDuration(url);
    return url;
  } catch (e) {
    console.log('polly service: ', e);
  }

  return '';
}
