import type { Notification } from './types';

/**
 * Single source of truth for "notification -> app route". Never derive a
 * destination from a backend-supplied URL — only from notification_type /
 * entity_type / entity_id / data, so the frontend owns navigation.
 *
 * To support a new notification type: add one entry here.
 */
const ROUTE_RESOLVERS: Record<string, (notification: Notification) => string> = {
  job_application_submitted: (n) =>
    `/dashboard/jobs/${n.data.job_id}/applications/${n.entity_id}`,
  job_application_status_changed: (n) =>
    `/dashboard/my-applications/${n.entity_id}`,
  service_request_submitted: (n) =>
    `/dashboard/requests-received/${n.entity_id}`,
  service_request_status_changed: (n) =>
    `/dashboard/my-requests/${n.entity_id}`,
};

export function resolveNotificationRoute(notification: Notification): string {
  const resolver = ROUTE_RESOLVERS[notification.notification_type];
  if (!resolver) return '/notifications';
  try {
    return resolver(notification);
  } catch {
    return '/notifications';
  }
}
