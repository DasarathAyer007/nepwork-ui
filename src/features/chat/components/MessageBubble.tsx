import { Check, CheckCheck, Clock } from 'lucide-react';

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
      className={`flex max-w-[75%] items-end gap-xs ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
      {!isMine && (
        <img
          alt={message.sender.username}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
          src={message.sender.profile_picture || '/default-avatar.png'}
        />
      )}
      <div
        className={`rounded-lg px-sm py-2 shadow-sm ${
          isMine
            ? 'rounded-br-sm bg-primary text-on-primary'
            : 'rounded-bl-sm border border-outline-variant/40 bg-surface-container-lowest text-on-surface'
        }`}>
        <p className="whitespace-pre-wrap wrap-break-word text-body-sm leading-relaxed">
          {message.content}
        </p>
        <div
          className={`mt-1 flex items-center gap-xs ${isMine ? 'justify-end' : ''}`}>
          <span
            className={`text-[10px] font-medium ${
              isMine ? 'text-on-primary/70' : 'text-on-surface-variant'
            }`}>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isMine &&
            (message.pending ? (
              <Clock size={12} className="text-on-primary/70" />
            ) : message.is_read ? (
              <CheckCheck size={14} className="text-on-primary/70" />
            ) : (
              <Check size={14} className="text-on-primary/70" />
            ))}
        </div>
      </div>
    </div>
  );
}
