import { useEffect, useMemo, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/hooks/useSelectore';

import webSocketService from '@/services/webSocketService';

import { useCreateChatMutation, useGetChatMessagesQuery } from '../chatApi';
import {
  selectLiveMessages,
  selectTypingUsers,
  setActiveChat,
} from '../chatSlice';
import { markChatAsRead } from '../chatThunks';
import type { Chat, ChatTarget, Message } from '../types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  target: ChatTarget;
  chat?: Chat | null; // full chat for existing mode
  currentUserId: string;
  onChatCreated?: (chatId: string, newChat: Chat) => void;
}

export default function ChatWindow({
  target,
  chat,
  currentUserId,
  onChatCreated,
}: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const [localDraftMessages] = useState<Message[]>([]);
  const [createChat, { isLoading: isCreating }] = useCreateChatMutation();
  const createChatInFlightRef = useRef(false);
  const otherMember =
    target.mode === 'existing'
      ? chat?.members.find((m) => m.id !== currentUserId)
      : target.otherUser;
  const chatId = target.mode === 'existing' ? target.chatId : null;
  const { data: historical = [], isLoading } = useGetChatMessagesQuery(
    chatId ?? '',
    {
      skip: !chatId,
    }
  );
  const liveMessages = useSelector(
    chatId ? selectLiveMessages(chatId) : () => []
  );
  const typingUsers = useSelector(
    chatId ? selectTypingUsers(chatId) : () => []
  );

  // Merge messages for existing chats
  const allMessages = useMemo<Message[]>(() => {
    if (!chatId) return [];
    const map = new Map<string, Message>();
    historical?.forEach((m) => map.set(m.id, m));
    liveMessages.forEach((m) => map.set(m.id, m));
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [historical, liveMessages, chatId]);

  // For draft mode, use local messages
  const displayMessages =
    target.mode === 'existing' ? allMessages : localDraftMessages;

  // Mark active chat in Redux and let the server know it's been read
  useEffect(() => {
    if (chatId) {
      dispatch(setActiveChat(chatId));
      dispatch(markChatAsRead(chatId));
      return () => {
        dispatch(setActiveChat(null));
      };
    }
  }, [chatId, dispatch]);

  // Send handler – decides between immediate send and draft creation
  const handleSend = async (content: string) => {
    if (target.mode === 'existing') {
      webSocketService.sendChatMessage(target.chatId, content);
      return;
    }

    if (createChatInFlightRef.current) return;

    createChatInFlightRef.current = true;

    try {
      const newChat = await createChat({
        member_ids: [target.otherUser.id],
      }).unwrap();

      webSocketService.sendChatMessage(newChat.id, content);
      onChatCreated?.(newChat.id, newChat);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      createChatInFlightRef.current = false;
    }
  };

  // Determine header info
  const headerName = otherMember?.full_name || otherMember?.username || 'User';
  const isOnline = Boolean(otherMember?.online);

  return (
    <section className="flex-1 flex flex-col bg-surface-bright">
      {/* Header */}
      <div className="h-16 border-b border-outline-variant flex items-center justify-between px-md bg-surface-container-lowest">
        <div className="flex items-center gap-sm">
          <div className="relative">
            <img
              alt={headerName}
              className="w-10 h-10 rounded-full object-cover"
              src={otherMember?.profile_picture || '/default-avatar.png'}
            />
          </div>
          <div>
            <h3 className="text-body-md font-bold text-on-surface">
              {headerName}
            </h3>
            <p className="text-[10px] text-primary font-extrabold uppercase tracking-widest">
              {typingUsers.length > 0
                ? 'Typing…'
                : isOnline
                  ? 'Online · Active Now'
                  : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-xs">{/* optional buttons */}</div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">
        {isLoading && (
          <div className="text-center text-body-sm text-on-surface-variant">
            Loading…
          </div>
        )}
        {target.mode === 'draft' &&
          !isLoading &&
          displayMessages.length === 0 && (
            <div className="text-center text-body-sm text-on-surface-variant mt-lg">
              No messages yet – say hi to {otherMember?.username}!
            </div>
          )}
        {displayMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-sm">
            <div className="bg-surface-container px-sm py-2 rounded-lg flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-label-sm text-on-surface-variant italic font-medium">
              {otherMember?.username ?? 'Someone'} is typing…
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isCreating}
        chatId={chatId ?? undefined}
        placeholder={
          target.mode === 'draft'
            ? 'Type your first message…'
            : 'Type your message…'
        }
      />
    </section>
  );
}
