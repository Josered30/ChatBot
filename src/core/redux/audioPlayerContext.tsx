import React from 'react';
import {createContext, useReducer} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type Type = '';

type Action = {
  type: Type;
  payload?: any;
};

type Dispatch = (action: Action) => void;

type State = {
  audioRecorderPlayer: AudioRecorderPlayer;
};

type AudioPlayerProviderProps = {children: React.ReactNode};

const initialState: State = {
  audioRecorderPlayer: new AudioRecorderPlayer(),
};

const AudioPlayerContext = createContext<
  {audioState: State; audioDispatch: Dispatch} | undefined
>(undefined);

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    default:
      return initialState;
  }
}

const AudioPlayerProvider = ({children}: AudioPlayerProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const value = {audioState: state, audioDispatch: dispatch};

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

function useAudio() {
  const context = React.useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export {AudioPlayerProvider, useAudio};
