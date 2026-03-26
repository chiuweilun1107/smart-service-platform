import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!value.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(value.trim());
      setValue('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 p-4 bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="輸入訊息..."
          disabled={isSending}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                     disabled:bg-slate-50 disabled:cursor-not-allowed
                     text-sm"
        />

        <VoiceInput onTranscript={setValue} />

        <button
          onClick={handleSend}
          disabled={!value.trim() || isSending}
          className="px-4 py-3 bg-blue-600 text-white rounded-xl
                     hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed
                     transition-colors flex items-center gap-2 font-semibold"
        >
          {isSending ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
