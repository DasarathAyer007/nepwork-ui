// ──────────────────────────────────────────────────────────
//  WebSocket wire contract — mirrors the Django Channels consumer.
//  Domain entities (User/Message/Chat/Notification) live in their
//  feature folders; this file only defines the frame shapes.
// ──────────────────────────────────────────────────────────
import type { Message } from '@/features/chat/types';
import type { Notification } from '@/features/notifications/types';

export type ClientMessageType =
  | 'chat.send'
  | 'chat.typing'
  | 'chat.read'
  | 'notification.read'
  | 'notification.read_all';

export interface ChatSendFrame {
  type: 'chat.send';
  chat_id: string;
  content: string;
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
}

export interface TypingIndicatorPayload {
  user_id: string;
  username: string;
  is_typing: boolean;
  chat_id: string;
}

export interface ChatReadConfirmedPayload {
  chat_id: string;
  marked_read: number;
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
