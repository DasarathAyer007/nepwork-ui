import type { User } from '@/features/chat/types';

export type NotificationType =
  | 'job_application_submitted'
  | 'service_request_submitted'
  | 'job_application_status_changed'
  | 'service_request_status_changed';

export interface Notification {
  id: number;
  sender: User | null;
  notification_type: NotificationType | string;
  title: string;
  message: string;
  entity_type: string;
  entity_id: string;
  data: Record<string, string>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export interface NotificationReadConfirmedPayload {
  notification_id: number;
  unread_count: number;
}

export interface NotificationReadAllConfirmedPayload {
  marked_read: number;
  unread_count: number;
}
