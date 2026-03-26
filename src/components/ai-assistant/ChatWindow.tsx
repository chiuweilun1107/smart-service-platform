import { useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useDraggable } from './useDraggable';
import type { Message } from './types';

interface ChatWindowProps {
  messages: Message[];
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatWindow({ messages, onClose, onSendMessage }: ChatWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { position, isDragging } = useDraggable(windowRef, '.drag-handle');

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      ref={windowRef}
      className="fixed z-50 w-[400px] h-[600px]
                 bg-white rounded-3xl shadow-2xl
                 flex flex-col overflow-hidden
                 animate-in fade-in zoom-in-95 duration-300"
      style={{
        bottom: '100px',
        right: '24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        willChange: isDragging ? 'transform' : 'auto'
      }}
    >
      {/* Header - 可拖曳區域 */}
      <div
        className="drag-handle cursor-move
                    bg-gradient-to-r from-blue-600 to-purple-600
                    px-6 py-4 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="text-white flex-shrink-0" size={24} />
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white truncate">AI 助手</h3>
            <p className="text-xs text-blue-100 truncate">智能勤務系統</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          title="關閉"
        >
          <X className="text-white" size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20 flex flex-col items-center">
            <Sparkles size={48} className="mb-4 opacity-50" />
            <p className="text-sm">您好！有什麼可以幫您的嗎？</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSendMessage} />
    </div>
  );
}
