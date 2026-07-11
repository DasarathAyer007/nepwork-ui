import { selectUser } from '@/features/auth/authSelectors';
import ActionRequiredPanel from '@/features/dashboard/components/overview/ActionRequiredPanel';
import AnalyticsSection from '@/features/dashboard/components/overview/AnalyticsSection';
import MessagesPreviewCard from '@/features/dashboard/components/overview/MessagesPreviewCard';
import NotificationsPreviewCard from '@/features/dashboard/components/overview/NotificationsPreviewCard';
import RecentActivityTimeline from '@/features/dashboard/components/overview/RecentActivityTimeline';
import RecentApplicationsCard from '@/features/dashboard/components/overview/RecentApplicationsCard';
import RecentJobsCard from '@/features/dashboard/components/overview/RecentJobsCard';
import RecentServicesCard from '@/features/dashboard/components/overview/RecentServicesCard';
import RecommendedJobsCard from '@/features/dashboard/components/overview/RecommendedJobsCard';
import RecommendedServicesCard from '@/features/dashboard/components/overview/RecommendedServicesCard';
import ServiceRequestsPreviewCard from '@/features/dashboard/components/overview/ServiceRequestsPreviewCard';
import StatsGrid from '@/features/dashboard/components/overview/StatsGrid';
import UpcomingEventsCard from '@/features/dashboard/components/overview/UpcomingEventsCard';
import WelcomeHeader from '@/features/dashboard/components/overview/WelcomeHeader';

import { useAppSelector } from '@/hooks/useSelectore';

export default function Overview() {
  const currentUser = useAppSelector(selectUser);

  return (
    <div className="space-y-6">
      <WelcomeHeader
        name={currentUser?.full_name || currentUser?.username || 'there'}
      />

      <StatsGrid />

      <ActionRequiredPanel />

      <RecentActivityTimeline />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <RecentJobsCard />
          <RecentApplicationsCard />
          <RecentServicesCard />
        </div>
        <div className="space-y-4">
          <MessagesPreviewCard />
          <NotificationsPreviewCard />
          <UpcomingEventsCard />
        </div>
      </div>

      <ServiceRequestsPreviewCard />

      <AnalyticsSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecommendedJobsCard />
        <RecommendedServicesCard />
      </div>
    </div>
  );
}
