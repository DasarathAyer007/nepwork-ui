import { selectUser } from '@/features/auth/authSelectors';
import { computeSkillMatch } from '@/features/dashboard/utils/overviewHelpers';
import { useGetServiceRecommendationsQuery } from '@/features/services/serviceApi';
import { useGetProfileDetailsQuery } from '@/features/user/api/profileApi';
import { MapPin, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

import PreviewCard from './PreviewCard';

export default function RecommendedServicesCard() {
  const currentUser = useAppSelector(selectUser);
  const { data: profile } = useGetProfileDetailsQuery(
    { username: currentUser?.username ?? '' },
    { skip: !currentUser?.username }
  );
  const profileSkills =
    profile && profile?.account_type === 'personal'
      ? (profile.skills?.map((s) => s.name) ?? [])
      : [];

  const { data } = useGetServiceRecommendationsQuery({ page_size: 4 });
  const services = data?.results ?? [];

  return (
    <PreviewCard
      title="Recommended Services"
      viewAllTo="/services"
      isEmpty={services.length === 0}
      emptyMessage="No recommendations yet.">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service) => {
          const match = computeSkillMatch(profileSkills, service.skills);
          const locationText =
            [service.location?.city, service.location?.country]
              .filter(Boolean)
              .join(', ') || 'Remote';

          return (
            <li key={service.id}>
              <Link
                to={`/services/${service.id}`}
                className="block border border-outline-variant/60 rounded-lg p-3 hover:border-primary/40 hover:shadow-sm transition-all group h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="size-8 rounded-md bg-surface-container-high text-outline flex items-center justify-center shrink-0">
                    <Wrench size={14} />
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {service.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-label-md text-on-surface-variant">
                  <MapPin size={11} />
                  {locationText}
                </div>
                {match && match.matched > 0 && (
                  <p className="text-label-md text-primary font-semibold mt-1.5">
                    {match.matched}/{match.total} skills match
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </PreviewCard>
  );
}
