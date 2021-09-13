export enum MessageType {
  AUDIO,
  TEXT,
}

export type TextContent = {
  text: string;
};

export type AudioContent = {
  path: string;
};

export interface Message {
  sender: 'bot' | 'user';
  id: number;
  type: MessageType;
  textContent?: TextContent;
  audioContent?: AudioContent;
}
