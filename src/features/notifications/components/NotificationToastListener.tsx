import { useEffect, useRef } from 'react';

import toast from 'react-hot-toast';

import { useAppSelector } from '@/hooks/useSelectore';

import { selectLiveNotifications } from '../notificationsSlice';

/**
 * Mounted once, app-wide. Fires a toast whenever a new notification is
 * pushed in over the WebSocket (notificationsSlice.notificationReceived
 * unshifts it to the front of liveNotifications).
 */
export default function NotificationToastListener() {
  const liveNotifications = useAppSelector(selectLiveNotifications);
  const lastSeenId = useRef<number | null>(null);

  useEffect(() => {
    const latest = liveNotifications[0];
    if (!latest || latest.id === lastSeenId.current) return;

    lastSeenId.current = latest.id;
    toast(latest.title, { icon: '🔔' });
  }, [liveNotifications]);

  return null;
}
