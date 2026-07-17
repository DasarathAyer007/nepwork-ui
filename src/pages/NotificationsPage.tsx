import { useState } from 'react';

import { BellOff } from 'lucide-react';

import Pagination from '@/components/Pagination';

import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import { useHandleNotificationClick } from '@/features/notifications/hooks/useHandleNotificationClick';
import { useGetNotificationsQuery } from '@/features/notifications/notificationsApi';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetNotificationsQuery({ page });
  const handleClick = useHandleNotificationClick();

  const notifications = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-headline-md font-bold text-text mb-6">
        Notifications
      </h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Loading…
          </p>
        )}

        {!isLoading && isError && (
          <p className="px-4 py-10 text-center text-sm text-error">
            Failed to load notifications. Please try again.
          </p>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <BellOff size={32} className="text-muted/50" />
            <p className="text-sm text-muted">
              You don't have any notifications yet.
            </p>
          </div>
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
