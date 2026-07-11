import { selectChatUnreadCount } from '@/features/chat/chatSlice';
import {
  useGetJobApplicationsQuery,
  useGetMyJobsQuery,
} from '@/features/jobs/jobApi';
import { selectUnreadCount } from '@/features/notifications/notificationsSlice';
import {
  useGetMyServicesQuery,
  useGetServiceRequestsQuery,
} from '@/features/services/serviceApi';
import {
  Bell,
  Briefcase,
  FileText,
  Inbox,
  MessageCircle,
  Users,
  Wrench,
} from 'lucide-react';

import { useAppSelector } from '@/hooks/useSelectore';

import StatCard from './StatCard';

function countToday(items: { created_at: string }[]): number {
  const today = new Date().toDateString();
  return items.filter(
    (item) => new Date(item.created_at).toDateString() === today
  ).length;
}

export default function StatsGrid() {
  const { data: activeJobs } = useGetMyJobsQuery({
    status: 'open',
    page_size: 1,
  });

  const { data: applicationsReceived } = useGetJobApplicationsQuery({
    scope: 'received',
    page_size: 20,
    ordering: '-created_at',
  });

  const { data: myApplications } = useGetJobApplicationsQuery({
    scope: 'applied',
    page_size: 1,
  });
  const { data: underReviewApplications } = useGetJobApplicationsQuery({
    scope: 'applied',
    status: 'under_review',
    page_size: 1,
  });

  const { data: activeServices } = useGetMyServicesQuery({
    status: 'active',
    page_size: 1,
  });

  const { data: requestsReceived } = useGetServiceRequestsQuery({
    scope: 'received',
    page_size: 1,
  });

  const unreadMessages = useAppSelector(selectChatUnreadCount);
  const unreadNotifications = useAppSelector(selectUnreadCount);

  const applicationsToday = applicationsReceived
    ? countToday(applicationsReceived.results)
    : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <StatCard
        icon={Briefcase}
        label="Active Jobs"
        value={activeJobs?.count ?? '—'}
        to="/dashboard/jobs"
      />
      <StatCard
        icon={Users}
        label="Applications Received"
        value={applicationsReceived?.count ?? '—'}
        subLabel={
          applicationsToday > 0 ? `+${applicationsToday} today` : undefined
        }
        to="/dashboard/jobs"
      />
      <StatCard
        icon={FileText}
        label="Applied Jobs"
        value={myApplications?.count ?? '—'}
        subLabel={
          underReviewApplications?.count
            ? `${underReviewApplications.count} under review`
            : undefined
        }
        to="/dashboard/my-applications"
      />
      <StatCard
        icon={Wrench}
        label="Active Services"
        value={activeServices?.count ?? '—'}
        to="/dashboard/services"
      />
      <StatCard
        icon={Inbox}
        label="Requests Received"
        value={requestsReceived?.count ?? '—'}
        to="/dashboard/requests-received"
      />
      <StatCard
        icon={MessageCircle}
        label="Unread Messages"
        value={unreadMessages}
        to="/messages"
      />
      <StatCard icon={Bell} label="Notifications" value={unreadNotifications} />
    </div>
  );
}
