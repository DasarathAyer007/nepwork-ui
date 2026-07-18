import type {
  ChatReadConfirmedPayload,
  TypingIndicatorPayload,
} from '@/types/websocket.types';
import {
  type PayloadAction,
  createAction,
  createSlice,
} from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import type { Chat, Message } from './types';

interface ChatState {
  messagesByChat: Record<string, Message[]>;
  typingByChat: Record<string, Record<string, string>>; // chatId -> userId -> username
  activeChatId: string | null;
  unreadCount: number;
  // True once an authoritative unread count has been applied (from the
  // socket's "connection.established" event, or a later live update).
  // Mirrors notificationsSlice's guard — there is no HTTP fallback for this
  // count anymore, so this mainly documents intent/ordering.
  hasHydratedUnreadCount: boolean;
}

const initialState: ChatState = {
  messagesByChat: {},
  typingByChat: {},
  activeChatId: null,
  unreadCount: 0,
  hasHydratedUnreadCount: false,
};

// Dispatched by WebSocketService on "chat.created"/"chat.started" — no
// chatSlice state to update directly, but chatListeners.ts listens for it
// to patch the chatApi `getChats` cache.
export const chatCreated = createAction<Chat>('chat/chatCreated');

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Authoritative unread-count set — used both for initial hydration
    // (from "connection.established") and for later live updates (from the
    // chatReadConfirmed listener), since the server always sends the true
    // global count rather than a delta.
    setChatUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
      state.hasHydratedUnreadCount = true;
    },

    incrementChatUnreadCount: (state) => {
      state.unreadCount += 1;
    },

    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },

    // Inbound from WebSocketService on "chat.message". If this is the
    // server's echo of our own optimistic send (matched by client_ref),
    // replace the pending local copy with the real, server-assigned message
    // instead of appending a second bubble.
    messageReceived: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const chatId = message.chat_id;
      const list = (state.messagesByChat[chatId] ??= []);

      const pendingIndex = message.client_ref
        ? list.findIndex((m) => m.id === message.client_ref && m.pending)
        : -1;

      if (pendingIndex !== -1) {
        list[pendingIndex] = message;
      } else if (!list.some((m) => m.id === message.id)) {
        list.push(message);
      }

      if (state.typingByChat[chatId]) {
        delete state.typingByChat[chatId][message.sender.id];
      }
    },

    // Inbound from WebSocketService on "chat.typing"
    typingReceived: (state, action: PayloadAction<TypingIndicatorPayload>) => {
      const { chat_id, user_id, username, is_typing } = action.payload;
      if (!state.typingByChat[chat_id]) {
        state.typingByChat[chat_id] = {};
      }
      if (is_typing) {
        state.typingByChat[chat_id][user_id] = username;
      } else {
        delete state.typingByChat[chat_id][user_id];
      }
    },

    // Inbound from WebSocketService on "chat.read_confirmed"
    chatReadConfirmed: (
      state,
      action: PayloadAction<ChatReadConfirmedPayload>
    ) => {
      const { chat_id } = action.payload;
      const messages = state.messagesByChat[chat_id];
      if (messages) {
        messages.forEach((m) => {
          m.is_read = true;
        });
      }
    },

    optimisticMessageAdded: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const chatId = message.chat_id;
      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }
      state.messagesByChat[chatId].push(message);
    },

    clearChatMessages: (state, action: PayloadAction<string>) => {
      delete state.messagesByChat[action.payload];
    },
  },
});

export const {
  setActiveChat,
  setChatUnreadCount,
  incrementChatUnreadCount,
  messageReceived,
  typingReceived,
  chatReadConfirmed,
  optimisticMessageAdded,
  clearChatMessages,
} = chatSlice.actions;

// Selectors — curried, so usage is useSelector(selectLiveMessages(chatId))
export const selectChatUnreadCount = (state: RootState): number =>
  state.chat.unreadCount;

export const selectLiveMessages =
  (chatId: string) =>
  (state: RootState): Message[] =>
    state.chat.messagesByChat[chatId] ?? [];

export const selectTypingUsers =
  (chatId: string) =>
  (state: RootState): string[] =>
    Object.values(state.chat.typingByChat[chatId] ?? {});

export const selectActiveChatId = (state: RootState): string | null =>
  state.chat.activeChatId;

export default chatSlice.reducer;
