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
    <div className="shrink-0 border-t border-outline-variant bg-surface-container-lowest p-md">
      <div className="flex items-end gap-xs rounded-full border border-outline-variant bg-surface px-sm py-1.5 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <button
          type="button"
          aria-label="Add attachment"
          className="rounded-full p-2 text-outline transition-colors hover:text-primary">
          <CirclePlus size={20} />
        </button>
        <button
          type="button"
          aria-label="Add emoji"
          className="rounded-full p-2 text-outline transition-colors hover:text-primary">
          <Smile size={20} />
        </button>
        <textarea
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none border-none bg-transparent py-2 text-body-sm outline-none placeholder:text-on-surface-variant focus:ring-0 focus:outline-none custom-scrollbar max-h-32"
        />
        <button
          type="button"
          aria-label="Send message"
          onClick={handleSend}
          disabled={disabled || !draft.trim()}
          className="bg-primary text-on-primary p-2 rounded-lg flex items-center justify-center hover:bg-primary-dim transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
          <Send
            size={18}
            className="transition-transform group-hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}
