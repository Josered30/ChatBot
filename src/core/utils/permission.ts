import {PermissionsAndroid} from 'react-native';

export const requestAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Grabacion de audio',
        message: 'Esta aplicacion necesita grabar audios',
        buttonNeutral: 'Preguntarme luego',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Puedes grabar audios');
      return true;
    } else {
      console.log('No puedes grabar audios');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
