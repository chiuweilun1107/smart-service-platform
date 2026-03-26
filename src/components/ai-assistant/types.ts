export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  isError?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error?: string;
}

export interface AIResponse {
  message: string;
  timestamp: Date;
  suggestions?: string[];
}
