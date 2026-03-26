import { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { useDraggable } from './useDraggable';
import { mockAIService } from '../../services/mockAIService';
import type { Message } from './types';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { position, isDragging } = useDraggable(buttonRef as any, '.drag-handle');

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      // 添加用戶消息
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        content: userMessage,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg]);

      try {
        // 獲取 AI 回覆
        const aiResponse = await mockAIService.sendMessage(userMessage);

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          content: aiResponse.message,
          sender: 'ai',
          timestamp: aiResponse.timestamp
        };

        setMessages(prev => [...prev, aiMsg]);
      } catch (error) {
        console.error('Failed to get AI response:', error);

        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          content: '抱歉，發生錯誤。請稍後重試。',
          sender: 'ai',
          timestamp: new Date(),
          isError: true
        };

        setMessages(prev => [...prev, errorMsg]);
      }
    },
    []
  );

  useEffect(() => {
    const handleTriggerWarning = (e: CustomEvent<{ message: string }>) => {
      setIsOpen(true);
      handleSendMessage(e.detail.message);
    };

    window.addEventListener('trigger-ai-warning', handleTriggerWarning as EventListener);
    return () => {
      window.removeEventListener('trigger-ai-warning', handleTriggerWarning as EventListener);
    };
  }, [handleSendMessage]);

  const handleClick = () => {
    // 只有在不拖曳時才打開聊天窗口
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* 浮動按鈕 - 可拖曳 */}
      <button
        ref={buttonRef}
        className="fixed z-50 w-16 h-16
                   bg-gradient-to-br from-blue-600 to-purple-600
                   rounded-2xl shadow-2xl shadow-blue-600/30
                   hover:shadow-blue-600/50 hover:scale-110
                   transition-all duration-300
                   flex items-center justify-center group
                   drag-handle cursor-grab active:cursor-grabbing"
        onClick={handleClick}
        title="打開 AI 助手"
        style={{
          bottom: '24px',
          right: '24px',
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <MessageCircle
          className="text-white group-hover:scale-110 transition-transform pointer-events-none"
          size={28}
        />
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}
