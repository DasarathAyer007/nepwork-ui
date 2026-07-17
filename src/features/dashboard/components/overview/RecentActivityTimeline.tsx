import EmptyState from '@/features/dashboard/components/EmptyState';
import { formatRelativeTime } from '@/features/dashboard/utils/overviewHelpers';
import { resolveNotificationRoute } from '@/features/notifications/notificationRoutes';
import { useGetLatestNotificationsQuery } from '@/features/notifications/notificationsApi';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentActivityTimeline() {
  const { data: notifications } = useGetLatestNotificationsQuery();
  const items = (notifications ?? []).slice(0, 8);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-5">
      <h2 className="text-title-md font-bold text-on-surface mb-3">
        Recent Activity
      </h2>

      {items.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Activity across your jobs and services will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const row = (
              <div className="flex items-start gap-3">
                <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} />
                </span>
                <div className="min-w-0">
                  <p className="text-body-sm font-medium text-on-surface">
                    {item.title}
                  </p>
                  {item.message && (
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {item.message}
                    </p>
                  )}
                  <p className="text-label-md text-on-surface-variant/70 mt-0.5">
                    {formatRelativeTime(item.created_at)}
                  </p>
                </div>
              </div>
            );

            return (
              <li key={item.id}>
                <Link
                  to={resolveNotificationRoute(item)}
                  className="block -m-1 p-1 rounded-lg hover:bg-surface-container transition-colors">
                  {row}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
