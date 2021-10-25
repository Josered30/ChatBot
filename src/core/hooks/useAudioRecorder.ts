import AudioRecord from 'react-native-audio-record';
import RNFetchBlob from 'rn-fetch-blob';

type RecordState = {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
};

export const useAudioRecorder = () => {
  const startRecord = async (url: string): Promise<void> => {
    if (await RNFetchBlob.fs.exists(url)) {
      await RNFetchBlob.fs.unlink(url);
    }

    const options = {
      sampleRate: 16000, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only (see below)
      wavFile: url, // default 'audio.wav'
    };

    AudioRecord.init(options);
    AudioRecord.start();
  };

  const stopRecord = (): Promise<string> => {
    return AudioRecord.stop();
  };

  return {
    startRecord,
    stopRecord,
  };
};
