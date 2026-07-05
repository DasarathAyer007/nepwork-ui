import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import type {
  ChatReadConfirmedPayload,
  TypingIndicatorPayload,
} from '@/types/websocket.types';

import type { Message } from './types';

interface ChatState {
  messagesByChat: Record<string, Message[]>;
  typingByChat: Record<string, Record<string, string>>; // chatId -> userId -> username
  activeChatId: string | null;
  unreadCount: number;
}

const initialState: ChatState = {
  messagesByChat: {},
  typingByChat: {},
  activeChatId: null,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    incrementChatUnreadCount: (state) => {
      state.unreadCount += 1;
    },

    decrementChatUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, state.unreadCount - action.payload);
    },
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },

    // Inbound from WebSocketService on "chat.message"
    messageReceived: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const chatId = message.chat_id;
      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }
      const exists = state.messagesByChat[chatId].some(
        (m) => m.id === message.id
      );
      if (!exists) {
        state.messagesByChat[chatId].push(message);
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
  decrementChatUnreadCount,
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
