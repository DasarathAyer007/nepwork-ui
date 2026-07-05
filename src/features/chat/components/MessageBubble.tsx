import { Check, CheckCheck } from 'lucide-react';

import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
}

export default function MessageBubble({
  message,
  currentUserId,
}: MessageBubbleProps) {
  const isMine = message.sender.id === currentUserId;

  return (
    <div
      className={`flex items-end gap-sm max-w-[85%] ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
      {!isMine && (
        <img
          alt={message.sender.username}
          className="w-8 h-8 rounded-full object-cover shrink-0"
          src={message.sender.profile_picture || '/default-avatar.png'}
        />
      )}
      <div
        className={`p-md rounded-lg shadow-sm ${
          isMine
            ? 'bg-primary text-on-primary rounded-br-none'
            : 'bg-surface-container-high rounded-bl-none border border-outline-variant/10'
        }`}>
        <p className="text-body-sm leading-relaxed">{message.content}</p>
        <div
          className={`flex items-center gap-xs mt-xs ${isMine ? 'justify-end' : ''}`}>
          <span
            className={`text-[10px] font-medium ${
              isMine ? 'text-primary-container/80' : 'text-on-surface-variant'
            }`}>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isMine &&
            (message.is_read ? (
              <CheckCheck size={14} className="text-on-primary/70" />
            ) : (
              <Check size={14} className="text-on-primary/70" />
            ))}
        </div>
      </div>
    </div>
  );
}
