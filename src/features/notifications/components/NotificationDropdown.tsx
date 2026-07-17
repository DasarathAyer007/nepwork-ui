import { useRef } from 'react';

import { BellOff, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

import { useClickOutside } from '@/hooks/useClickOutSide';

import { NotificationItem } from './NotificationItem';
import {
  useGetLatestNotificationsQuery,
  useMarkAllNotificationsReadHttpMutation,
} from '../notificationsApi';
import { selectLiveNotifications } from '../notificationsSlice';
import { useHandleNotificationClick } from '../hooks/useHandleNotificationClick';
import type { Notification } from '../types';

type NotificationDropdownProps = {
  onClose: () => void;
};

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);

  const liveNotifications = useAppSelector(selectLiveNotifications);
  const { data: fetched, isLoading } = useGetLatestNotificationsQuery();
  const [markAllRead] = useMarkAllNotificationsReadHttpMutation();

  // Live (socket-delivered) notifications take precedence; fall back to the
  // HTTP-fetched latest-10 for anything received before this page loaded.
  const seen = new Set(liveNotifications.map((n) => n.id));
  const merged: Notification[] = [
    ...liveNotifications,
    ...(fetched ?? []).filter((n) => !seen.has(n.id)),
  ].slice(0, 10);

  const handleClick = useHandleNotificationClick(onClose);

  const handleMarkAllRead = () => {
    markAllRead();
  };

  return (
    <div
      ref={modalRef}
      className="
        absolute right-0 top-14 w-96 max-w-[90vw]
        bg-card border border-border
        rounded-2xl shadow-form
        overflow-hidden z-50
        animate-in fade-in slide-in-from-top-2 duration-200
      ">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="font-semibold text-text text-sm">Notifications</p>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          <CheckCheck size={14} />
          Mark all read
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-border">
        {isLoading && merged.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted">
            Loading…
          </p>
        )}

        {!isLoading && merged.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <BellOff size={28} className="text-muted/50" />
            <p className="text-sm text-muted">You're all caught up.</p>
          </div>
        )}

        {merged.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleClick}
          />
        ))}
      </div>

      <div className="border-t border-border p-2">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block w-full text-center text-sm font-medium text-primary hover:bg-primary/5 rounded-xl py-2 transition-colors">
          View all
        </Link>
      </div>
    </div>
  );
}
