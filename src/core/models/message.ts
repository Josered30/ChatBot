import {FormatType} from './enums/formatType';

export interface Message {
  sender: 'bot' | 'user';
  id: number;
  type: FormatType;
  textContent?: string;
  audioContent?: string;
}
