import { formatRelativeTime } from '@/features/dashboard/utils/overviewHelpers';
import { useGetNotificationsQuery } from '@/features/notifications/notificationsApi';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

import PreviewCard from './PreviewCard';

export default function NotificationsPreviewCard() {
  const { data: notifications } = useGetNotificationsQuery();
  const preview = (notifications ?? []).slice(0, 3);

  return (
    <PreviewCard
      title="Notifications"
      isEmpty={preview.length === 0}
      emptyMessage="No notifications yet.">
      <ul className="divide-y divide-outline-variant/40">
        {preview.map((notification) => {
          const row = (
            <div className="flex items-start gap-3 py-2.5">
              <span
                className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  notification.is_read
                    ? 'bg-surface-container-high text-on-surface-variant'
                    : 'bg-primary/10 text-primary'
                }`}>
                <Check size={13} />
              </span>
              <div className="min-w-0">
                <p className="text-body-sm font-medium text-on-surface truncate">
                  {notification.title}
                </p>
                <p className="text-label-md text-on-surface-variant/70">
                  {formatRelativeTime(notification.created_at)}
                </p>
              </div>
            </div>
          );

          return (
            <li key={notification.id}>
              {notification.action_url ? (
                <Link
                  to={notification.action_url}
                  className="block -m-1 p-1 rounded-lg hover:bg-surface-container transition-colors">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </PreviewCard>
  );
}
