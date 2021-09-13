import {useState} from 'react';
import AudioRecorderPlayer, {
  RecordBackType,
} from 'react-native-audio-recorder-player';
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

export const useAudioRecorder = (audioRecorderPlayer: AudioRecorderPlayer) => {
  const [record, setRecord] = useState<RecordState>({
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });

  const resetState = () => {
    setRecord({
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    });
  };

  const onStartRecord = async (path: string) => {
    if (await RNFetchBlob.fs.exists(path)) {
      await RNFetchBlob.fs.unlink(path);
    }
    await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      setRecord(v => ({
        ...v,
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      }));
      return;
    });
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    resetState();
    return result;
  };

  const onStartPlay = async (url: string) => {
    const msg = await audioRecorderPlayer.startPlayer(url);
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      setRecord(v => ({
        ...v,
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      }));
      return;
    });
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    resetState();
  };

  return {
    record,
    onStartRecord,
    onStopRecord,
    onStartPlay,
    onPausePlay,
    onStopPlay,
    resetState,
  };
};
