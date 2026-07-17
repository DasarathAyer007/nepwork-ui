import { Briefcase, Wrench } from 'lucide-react';

import { formatRelativeTime } from '../utils/formatRelativeTime';
import type { Notification } from '../types';

const TYPE_ICON: Record<string, React.ReactNode> = {
  job_application_submitted: <Briefcase size={16} />,
  job_application_status_changed: <Briefcase size={16} />,
  service_request_submitted: <Wrench size={16} />,
  service_request_status_changed: <Wrench size={16} />,
};

type NotificationItemProps = {
  notification: Notification;
  onClick: (notification: Notification) => void;
};

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const icon = TYPE_ICON[notification.notification_type] ?? (
    <Briefcase size={16} />
  );

  return (
    <button
      onClick={() => onClick(notification)}
      className={`
        group flex w-full items-start gap-3 px-4 py-3 text-left
        transition-colors duration-150
        ${
          notification.is_read
            ? 'bg-transparent hover:bg-muted/5'
            : 'bg-primary/6 hover:bg-primary/10'
        }
      `}>
      <span
        className={`
          shrink-0 size-8 rounded-lg flex items-center justify-center mt-0.5
          ${notification.is_read ? 'bg-muted/10 text-muted' : 'bg-primary/15 text-primary'}
        `}>
        {icon}
      </span>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-tight truncate ${
            notification.is_read
              ? 'font-normal text-muted'
              : 'font-semibold text-text'
          }`}>
          {notification.title}
        </p>
        <p
          className={`text-xs leading-snug mt-0.5 line-clamp-2 ${
            notification.is_read ? 'text-muted/70' : 'text-muted'
          }`}>
          {notification.message}
        </p>
        <p className="text-[11px] text-muted/60 mt-1">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>

      {!notification.is_read && (
        <span
          className="shrink-0 size-2 rounded-full bg-primary mt-2"
          aria-label="Unread"
        />
      )}
    </button>
  );
}
