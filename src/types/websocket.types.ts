// ──────────────────────────────────────────────────────────
//  WebSocket wire contract — mirrors the Django Channels consumer.
//  Domain entities (User/Message/Chat/Notification) live in their
//  feature folders; this file only defines the frame shapes.
// ──────────────────────────────────────────────────────────
import type { Chat, Message } from '@/features/chat/types';
import type { Notification } from '@/features/notifications/types';

export type ClientMessageType =
  | 'chat.start'
  | 'chat.send'
  | 'chat.typing'
  | 'chat.read'
  | 'notification.read'
  | 'notification.read_all';

export interface ChatStartFrame {
  type: 'chat.start';
  member_ids: string[];
  content: string;
  client_ref?: string;
}

export interface ChatSendFrame {
  type: 'chat.send';
  chat_id: string;
  content: string;
  client_ref?: string;
}

export interface ChatTypingFrame {
  type: 'chat.typing';
  chat_id: string;
  is_typing: boolean;
}

export interface ChatReadFrame {
  type: 'chat.read';
  chat_id: string;
}

export interface NotificationReadFrame {
  type: 'notification.read';
  notification_id: number;
}

export interface NotificationReadAllFrame {
  type: 'notification.read_all';
}

export type ClientFrame =
  | ChatStartFrame
  | ChatSendFrame
  | ChatTypingFrame
  | ChatReadFrame
  | NotificationReadFrame
  | NotificationReadAllFrame;

// ──────────────────────────────────────────────────────────
//  WebSocket message contract — Server → Client
// ──────────────────────────────────────────────────────────

export interface ConnectionEstablishedPayload {
  user_id: string;
  unread_notifications: number;
  unread_chat_messages: number;
}

export interface TypingIndicatorPayload {
  user_id: string;
  username: string;
  is_typing: boolean;
  chat_id: string;
}

export interface ChatReadConfirmedPayload {
  chat_id: string;
  reader_id: string;
  marked_read: number;
  unread_count: number;
}

export interface ChatStartedPayload {
  chat: Chat;
  message: Message;
  client_ref?: string;
}

export interface NotificationReadConfirmedPayload {
  notification_id: number;
  unread_count: number;
}

export interface NotificationReadAllConfirmedPayload {
  marked_read: number;
  unread_count: number;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

export type ServerEvent =
  | { type: 'connection.established'; payload: ConnectionEstablishedPayload }
  | { type: 'chat.created'; payload: Chat }
  | { type: 'chat.started'; payload: ChatStartedPayload }
  | { type: 'chat.message'; payload: Message }
  | { type: 'chat.typing'; payload: TypingIndicatorPayload }
  | { type: 'chat.read_confirmed'; payload: ChatReadConfirmedPayload }
  | { type: 'notification.new'; payload: Notification }
  | {
      type: 'notification.read_confirmed';
      payload: NotificationReadConfirmedPayload;
    }
  | {
      type: 'notification.read_all_confirmed';
      payload: NotificationReadAllConfirmedPayload;
    }
  | { type: 'error'; payload: ErrorPayload };
