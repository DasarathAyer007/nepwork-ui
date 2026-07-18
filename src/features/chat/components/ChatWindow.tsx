import { useEffect, useMemo, useRef } from 'react';

import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

import { selectUser } from '@/features/auth/authSelectors';
import { useAppDispatch, useAppSelector } from '@/hooks/useSelectore';

import webSocketService from '@/services/webSocketService';

import { useCreateChatMutation, useGetChatMessagesQuery } from '../chatApi';
import {
  optimisticMessageAdded,
  selectLiveMessages,
  selectTypingUsers,
  setActiveChat,
} from '../chatSlice';
import type { Chat, ChatTarget, Message } from '../types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  target: ChatTarget;
  chat?: Chat | null; // full chat for existing mode
  currentUserId: string;
  onChatCreated?: (chatId: string, newChat: Chat) => void;
  onBack?: () => void;
  className?: string;
}

export default function ChatWindow({
  target,
  chat,
  currentUserId,
  onChatCreated,
  onBack,
  className = 'flex',
}: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
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

  // Draft mode shows nothing until the first send resolves and creates the
  // chat (handleSend then hands off to onChatCreated, which switches this
  // component to 'existing' mode with the real chatId).
  const displayMessages = target.mode === 'existing' ? allMessages : [];

  // Mark active chat in Redux and let the server know it's been read. No
  // optimistic local zeroing here — the server echoes chat_read_confirmed
  // back to the reader's own connection too, and chatListeners.ts applies
  // the authoritative count from that event.
  useEffect(() => {
    if (chatId) {
      dispatch(setActiveChat(chatId));
      webSocketService.markChatRead(chatId);
      return () => {
        dispatch(setActiveChat(null));
      };
    }
  }, [chatId, dispatch]);

  // Builds the local "sending…" bubble shown immediately, before the
  // server round-trip completes. Reconciled with the real message in
  // chatSlice.messageReceived once the server echoes it back (matched by
  // client_ref) — so sends feel instant instead of waiting on a full
  // client → server → broadcast round-trip.
  const addOptimisticMessage = (
    chatId: string,
    content: string,
    tempId: string
  ) => {
    if (!currentUser) return;
    dispatch(
      optimisticMessageAdded({
        id: tempId,
        chat_id: chatId,
        sender: {
          id: currentUser.id,
          username: currentUser.username,
          profile_picture: currentUser.profile_picture,
          full_name: currentUser.full_name,
        },
        content,
        is_read: false,
        created_at: new Date().toISOString(),
        client_ref: tempId,
        pending: true,
      })
    );
  };

  // Send handler – decides between immediate send and draft creation
  const handleSend = async (content: string) => {
    const tempId = crypto.randomUUID();

    if (target.mode === 'existing') {
      addOptimisticMessage(target.chatId, content, tempId);
      webSocketService.sendChatMessage(target.chatId, content, tempId);
      return;
    }

    if (createChatInFlightRef.current) return;

    createChatInFlightRef.current = true;

    try {
      const newChat = await createChat({
        member_ids: [target.otherUser.id],
      }).unwrap();

      addOptimisticMessage(newChat.id, content, tempId);
      webSocketService.sendChatMessage(newChat.id, content, tempId);
      onChatCreated?.(newChat.id, newChat);
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      createChatInFlightRef.current = false;
    }
  };

  // Determine header info
  const headerName = otherMember?.full_name || otherMember?.username || 'User';

  return (
    <section className={`${className} min-w-0 flex-1 flex-col bg-surface-container-low/30`}>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-md">
        <div className="flex min-w-0 items-center gap-sm">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to chats"
              className="-ml-1 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low md:hidden">
              <ArrowLeft size={20} />
            </button>
          )}
          <img
            alt={headerName}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            src={otherMember?.profile_picture || '/default-avatar.png'}
          />
          <div className="min-w-0">
            <h3 className="truncate text-body-md font-bold text-on-surface">
              {headerName}
            </h3>
            {typingUsers.length > 0 && (
              <p className="truncate text-label-sm font-medium text-primary">
                typing…
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-xs">{/* optional buttons */}</div>
      </div>

      {/* Messages area */}
      <div className="custom-scrollbar flex-1 space-y-sm overflow-y-auto p-md">
        {isLoading && (
          <div className="text-center text-body-sm text-on-surface-variant">
            Loading…
          </div>
        )}
        {target.mode === 'draft' &&
          !isLoading &&
          displayMessages.length === 0 && (
            <div className="mt-lg text-center text-body-sm text-on-surface-variant">
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
            <div className="flex items-center gap-1 rounded-full bg-surface-container-high px-sm py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline-variant" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline-variant [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline-variant [animation-delay:0.4s]" />
            </div>
            <span className="text-label-sm font-medium italic text-on-surface-variant">
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
