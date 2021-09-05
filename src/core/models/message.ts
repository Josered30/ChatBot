export interface Message {
  sender: 'bot' | 'user';
  text: String;
  id: number;
}
