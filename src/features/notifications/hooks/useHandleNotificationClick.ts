import { useNavigate } from 'react-router-dom';

import { resolveNotificationRoute } from '../notificationRoutes';
import { useMarkNotificationReadHttpMutation } from '../notificationsApi';
import type { Notification } from '../types';

/**
 * Centralized notification click behavior: mark-as-read (if unread) via the
 * HTTP API — which optimistically updates the cache/unread badge before the
 * response even arrives — then navigate via the route resolver, then run
 * any cleanup (e.g. closing a dropdown).
 */
export function useHandleNotificationClick(onAfterNavigate?: () => void) {
  const navigate = useNavigate();
  const [markNotificationRead] = useMarkNotificationReadHttpMutation();

  return (notification: Notification) => {
    if (!notification.is_read) {
      markNotificationRead(notification.id);
    }
    navigate(resolveNotificationRoute(notification));
    onAfterNavigate?.();
  };
}
