/**
 * Cross-slice sync for chat events — replaces chatThunks.ts.
 *
 * WebSocketService only dispatches plain actions (messageReceived,
 * chatReadConfirmed, chatCreated). Those actions alone can't keep the
 * chatApi RTK Query cache in sync with chatSlice, because a plain reducer
 * in chatSlice can't reach into a separate `createApi` cache without
 * importing it (which chatSlice deliberately doesn't do). This listener
 * middleware is where that fan-out lives instead.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from '../store';
import { chatApi } from '../../features/chat/chatApi';
import {
  chatCreated,
  chatReadConfirmed,
  incrementChatUnreadCount,
  messageReceived,
  setChatUnreadCount,
} from '../../features/chat/chatSlice';
import webSocketService from '../../services/webSocketService';

export const chatListenerMiddleware = createListenerMiddleware();

const startListening = chatListenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

// New message arrived — bump the badge (only for a genuinely-unread,
// not-currently-open chat) and keep the sidebar's preview/ordering in sync.
// If the message's chat IS the one currently open, immediately echo a
// chat.read back to the server instead — this is what flips the sender's
// checkmark from single to double in real time (WhatsApp/Messenger-style
// read receipts), not just on first opening the chat but for every message
// that arrives while the recipient is actively viewing it.
startListening({
  actionCreator: messageReceived,
  effect: (action, listenerApi) => {
    const message = action.payload;
    const state = listenerApi.getState();
    const currentUserId = state.auth.user?.id;
    const activeChatId = state.chat.activeChatId;

    const isFromOther = message.sender.id !== currentUserId;
    const isActiveChat = activeChatId === message.chat_id;
    const isIncoming = isFromOther && !isActiveChat;

    const chatsQuery = chatApi.endpoints.getChats.select()(state);
    const existingChat = chatsQuery.data?.find(
      (c) => c.id === message.chat_id
    );
    const wasChatUnread = Boolean(existingChat?.unread_count);

    if (isIncoming && !wasChatUnread) {
      listenerApi.dispatch(incrementChatUnreadCount());
    }

    listenerApi.dispatch(
      chatApi.util.updateQueryData('getChats', undefined, (draft) => {
        const chat = draft.find((c) => c.id === message.chat_id);
        if (!chat) return; // brand-new chat: the chatCreated listener covers this
        chat.last_message = message;
        if (isIncoming) {
          chat.unread_count = (chat.unread_count ?? 0) + 1;
        }
        draft.sort(
          (a, b) =>
            new Date(b.last_message?.created_at ?? 0).getTime() -
            new Date(a.last_message?.created_at ?? 0).getTime()
        );
      })
    );

    if (isFromOther && isActiveChat) {
      webSocketService.markChatRead(message.chat_id);
    }
  },
});

// Read receipt confirmed by the server (possibly from another tab/device) —
// the server always sends the true GLOBAL count, so apply it directly
// rather than decrementing a local guess.
startListening({
  actionCreator: chatReadConfirmed,
  effect: (action, listenerApi) => {
    const { chat_id, unread_count } = action.payload;

    listenerApi.dispatch(setChatUnreadCount(unread_count));
    listenerApi.dispatch(
      chatApi.util.updateQueryData('getChats', undefined, (draft) => {
        const chat = draft.find((c) => c.id === chat_id);
        if (chat) chat.unread_count = 0;
      })
    );
  },
});

// New chat pushed from the server (via chat.start or another member's
// first message) — add it to the cached list immediately.
startListening({
  actionCreator: chatCreated,
  effect: (action, listenerApi) => {
    const chat = action.payload;
    listenerApi.dispatch(
      chatApi.util.updateQueryData('getChats', undefined, (draft) => {
        if (draft.some((c) => c.id === chat.id)) return;
        draft.unshift(chat);
      })
    );
  },
});
