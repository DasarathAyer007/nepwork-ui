import { selectUser } from '@/features/auth/authSelectors';
import { computeProfileCompleteness } from '@/features/dashboard/utils/overviewHelpers';
import { useGetJobApplicationsQuery } from '@/features/jobs/jobApi';
import { useGetServiceRequestsQuery } from '@/features/services/serviceApi';
import { useGetProfileDetailsQuery } from '@/features/user/api/profileApi';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, ArrowRight, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

export default function ActionRequiredPanel() {
  const currentUser = useAppSelector(selectUser);

  const { data: toReview } = useGetJobApplicationsQuery({
    scope: 'received',
    status: 'applied',
    page_size: 1,
  });
  const { data: awaitingInterview } = useGetJobApplicationsQuery({
    scope: 'received',
    status: 'under_review',
    page_size: 1,
  });
  const { data: toRespond } = useGetServiceRequestsQuery({
    scope: 'received',
    status: 'open',
    page_size: 1,
  });
  const { data: profile } = useGetProfileDetailsQuery(
    { username: currentUser?.username ?? '' },
    { skip: !currentUser?.username }
  );

  const completeness = profile ? computeProfileCompleteness(profile) : null;

  type ActionItem = {
    key: string;
    text: string;
    to: string;
    icon?: LucideIcon;
  };

  const items = [
    toReview?.count
      ? {
          key: 'review',
          text: `${toReview.count} application${toReview.count === 1 ? '' : 's'} need${toReview.count === 1 ? 's' : ''} review`,
          to: '/dashboard/jobs',
        }
      : null,
    awaitingInterview?.count
      ? {
          key: 'interview',
          text: `${awaitingInterview.count} candidate${awaitingInterview.count === 1 ? '' : 's'} awaiting interview scheduling`,
          to: '/dashboard/jobs',
        }
      : null,
    toRespond?.count
      ? {
          key: 'respond',
          text: `Respond to ${toRespond.count} service request${toRespond.count === 1 ? '' : 's'}`,
          to: '/dashboard/requests-received',
        }
      : null,
    completeness !== null && completeness < 100
      ? {
          key: 'profile',
          text: `Complete your profile (${completeness}%)`,
          to: currentUser?.username
            ? `/profile/${currentUser.username}`
            : '/onboarding',
          icon: UserCircle,
        }
      : null,
  ].filter(Boolean) as ActionItem[];

  if (items.length === 0) return null;

  return (
    <div className="border border-warning/40 bg-warning/5 rounded-lg p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-warning" />
        <h2 className="text-title-md font-bold text-on-surface">
          Action Required
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map(({ key, text, to, icon: Icon }) => (
          <Link
            key={key}
            to={to}
            className="flex items-center justify-between gap-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3.5 py-2.5 hover:border-warning/50 hover:shadow-sm transition-all group">
            <span className="flex items-center gap-2 text-body-sm font-medium text-on-surface">
              {Icon ? (
                <Icon size={15} className="text-warning shrink-0" />
              ) : (
                <AlertTriangle size={15} className="text-warning shrink-0" />
              )}
              {text}
            </span>
            <ArrowRight
              size={14}
              className="text-on-surface-variant/50 group-hover:text-warning transition-colors shrink-0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
