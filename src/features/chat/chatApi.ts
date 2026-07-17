import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type { Chat, Message } from './types';

interface CreateChatRequest {
  name?: string;
  member_ids: string[];
}

interface UpdateChatRequest {
  chatId: string;
  name?: string;
}

interface SendMessageHttpRequest {
  chatId: string;
  content: string;
}

/**
 * RTK Query endpoints mirroring the Django REST views. Real-time updates
 * (new messages, typing) flow through the WebSocket and chatSlice, NOT
 * through RTK Query refetching — this keeps the socket as the source of
 * truth for live data while RTK Query owns historical/cached data and
 * mutations.
 */
export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQuery,
  tagTypes: ['Chat', 'Message'] as const,
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], void>({
      query: () => 'chats/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Chat' as const, id })),
              { type: 'Chat' as const, id: 'LIST' },
            ]
          : [{ type: 'Chat' as const, id: 'LIST' }],
    }),

    getChatDetail: builder.query<Chat, string>({
      query: (chatId) => `chats/${chatId}/`,
      providesTags: (_result, _error, chatId) => [{ type: 'Chat', id: chatId }],
    }),

    createChat: builder.mutation<Chat, CreateChatRequest>({
      query: (body) => ({
        url: 'chats/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
    }),

    updateChat: builder.mutation<Chat, UpdateChatRequest>({
      query: ({ chatId, ...patch }) => ({
        url: `chats/${chatId}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { chatId }) => [
        { type: 'Chat', id: chatId },
      ],
    }),

    getChatWithUser: builder.query<Chat | null, string>({
      query: (userId) => `/chats/with-user/${userId}`,
      transformResponse: (response: Chat | null) => response ?? null,
    }),

    getChatMessages: builder.query<Message[], string>({
      query: (chatId) => `chats/${chatId}/messages/`,
      providesTags: (_result, _error, chatId) => [
        { type: 'Message', id: chatId },
      ],
    }),

    // HTTP fallback for sending (e.g. attachments later) — normal sends go
    // through WebSocketService.sendChatMessage() instead.
    sendMessageHttp: builder.mutation<Message, SendMessageHttpRequest>({
      query: ({ chatId, content }) => ({
        url: `chats/${chatId}/messages/send/`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { chatId }) => [
        { type: 'Message', id: chatId },
      ],
    }),

    markChatReadHttp: builder.mutation<{ marked_read: number }, string>({
      query: (chatId) => ({
        url: `chats/${chatId}/read/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, chatId) => [
        { type: 'Chat', id: chatId },
      ],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatDetailQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useGetChatWithUserQuery,
  useGetChatMessagesQuery,
  useSendMessageHttpMutation,
  useMarkChatReadHttpMutation,
} = chatApi;
