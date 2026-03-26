import { useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useVoiceRecognition } from './useVoiceRecognition';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const { isListening, transcript, isSupported, startListening, stopListening } =
    useVoiceRecognition();

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
    }
  }, [transcript, isListening, onTranscript]);

  if (!isSupported) {
    return null; // 不支持則隱藏按鈕
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-3 rounded-xl transition-all ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
      title={isListening ? '點擊停止錄音' : '點擊開始語音輸入'}
    >
      <Mic size={20} />
    </button>
  );
}
