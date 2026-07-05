import type { ChatReadConfirmedPayload } from '@/types/websocket.types';

import type { AppDispatch, RootState } from '../../app/store';
import webSocketService from '../../services/webSocketService';
import { chatApi } from './chatApi';
import { chatReadConfirmed, messageReceived } from './chatSlice';
import type { Chat, Message } from './types';

/**
 * Keeps the chatSlice (live message list) and the chatApi cache (sidebar
 * previews, unread badges, ordering) in sync whenever a message arrives
 * over the WebSocket. This is the only place that should touch both.
 */
export const handleIncomingChatMessage =
  (message: Message) => (dispatch: AppDispatch, getState: () => RootState) => {
    const currentUserId = getState().auth.user?.id;
    const activeChatId = getState().chat.activeChatId;

    dispatch(messageReceived(message));

    dispatch(
      chatApi.util.updateQueryData('getChats', undefined, (draft) => {
        const chat = draft.find((c) => c.id === message.chat_id);
        if (!chat) return; // brand-new chat: handleChatCreated covers this
        chat.last_message = message;
        if (
          message.sender.id !== currentUserId &&
          activeChatId !== message.chat_id
        ) {
          chat.unread_count = (chat.unread_count ?? 0) + 1;
        }
        draft.sort(
          (a, b) =>
            new Date(b.last_message?.created_at ?? 0).getTime() -
            new Date(a.last_message?.created_at ?? 0).getTime()
        );
      })
    );
  };

// Inbound "chat.read_confirmed" — keeps the sidebar badge in sync with
// read receipts confirmed by the server (e.g. read from another tab/device).
export const handleChatReadConfirmed =
  (payload: ChatReadConfirmedPayload) => (dispatch: AppDispatch) => {
    dispatch(chatReadConfirmed(payload));
    dispatch(
      chatApi.util.updateQueryData('getChats', undefined, (draft) => {
        const chat = draft.find((c) => c.id === payload.chat_id);
        if (chat) chat.unread_count = 0;
      })
    );
  };

// New chat created (via HTTP) — add it to the cached list immediately so
// the sidebar reflects it before the invalidated query refetches.
export const handleChatCreated = (chat: Chat) => (dispatch: AppDispatch) => {
  dispatch(
    chatApi.util.updateQueryData('getChats', undefined, (draft) => {
      if (draft.some((c) => c.id === chat.id)) return;
      draft.unshift(chat);
    })
  );
};

export const markChatAsRead = (chatId: string) => (dispatch: AppDispatch) => {
  webSocketService.markChatRead(chatId);
  dispatch(
    chatApi.util.updateQueryData('getChats', undefined, (draft) => {
      const chat = draft.find((c) => c.id === chatId);
      if (chat) chat.unread_count = 0;
    })
  );
};
