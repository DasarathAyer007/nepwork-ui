import type { User } from '@/features/chat/types';

export interface Notification {
  id: number;
  sender: User | null;
  title: string;
  message: string;
  action_url: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationReadConfirmedPayload {
  notification_id: number;
  unread_count: number;
}

export interface NotificationReadAllConfirmedPayload {
  marked_read: number;
  unread_count: number;
}
