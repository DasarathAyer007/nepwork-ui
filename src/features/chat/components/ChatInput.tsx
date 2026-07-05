import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

import { CirclePlus, Send, Smile } from 'lucide-react';

import webSocketService from '@/services/webSocketService';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  chatId?: string; 
}

export default function ChatInput({
  onSend,
  disabled,
  placeholder = 'Type your message...',
  chatId,
}: ChatInputProps) {
  const [draft, setDraft] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = () => {
    const content = draft.trim();
    if (!content || disabled) return;
    onSend(content);
    setDraft('');
    // Stop typing indicator
    if (chatId) {
      webSocketService.sendTyping(chatId, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    if (chatId) {
      webSocketService.sendTyping(chatId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        webSocketService.sendTyping(chatId, false);
      }, 2000);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-md bg-surface-container-lowest border-t border-outline-variant">
      <div className="flex items-end gap-sm bg-surface px-sm py-sm rounded-lg border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <button
          type="button"
          aria-label="Add attachment"
          className="p-xs text-outline hover:text-primary transition-colors">
          <CirclePlus size={20} />
        </button>
        <button
          type="button"
          aria-label="Add emoji"
          className="p-xs text-outline hover:text-primary transition-colors">
          <Smile size={20} />
        </button>
        <textarea
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 text-body-sm resize-none py-1 max-h-32 custom-scrollbar placeholder:text-on-surface-variant"
        />
        <button
          type="button"
          aria-label="Send message"
          onClick={handleSend}
          disabled={disabled || !draft.trim()}
          className="bg-primary text-on-primary p-2 rounded-lg flex items-center justify-center hover:bg-primary-dim transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
          <Send size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
