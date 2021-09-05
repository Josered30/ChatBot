import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

interface UseKeyBoardProps {
  keyboardShow?: () => void;
  keyboardHide?: () => void;
}

function useKeyboard(props: UseKeyBoardProps | null = null) {
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const showEvent = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboard(true);
      if (props && props?.keyboardShow) {
        props.keyboardShow();
      }
    });

    const hideEvent = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false);
      if (props && props?.keyboardHide) {
        props.keyboardHide();
      }
    });

    return () => {
      showEvent.remove();
      hideEvent.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyboard;
}
export default useKeyboard;
