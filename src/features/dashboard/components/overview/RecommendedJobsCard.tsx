import { selectUser } from '@/features/auth/authSelectors';
import { computeSkillMatch } from '@/features/dashboard/utils/overviewHelpers';
import { useGetJobRecommendationsQuery } from '@/features/jobs/jobApi';
import { useGetProfileDetailsQuery } from '@/features/user/api/profileApi';
import { Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

import PreviewCard from './PreviewCard';

export default function RecommendedJobsCard() {
  const currentUser = useAppSelector(selectUser);
  const { data: profile } = useGetProfileDetailsQuery(
    { username: currentUser?.username ?? '' },
    { skip: !currentUser?.username }
  );
  const profileSkills =
    profile?.account_type === 'personal'
      ? (profile.skills?.map((s) => s.name) ?? [])
      : [];

  const { data } = useGetJobRecommendationsQuery({ page_size: 4 });
  const jobs = data?.results ?? [];

  return (
    <PreviewCard
      title="Recommended Jobs"
      viewAllTo="/jobs"
      isEmpty={jobs.length === 0}
      emptyMessage="No recommendations yet — apply to a few jobs to get personalized picks.">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {jobs.map((job) => {
          const match = computeSkillMatch(profileSkills, job.skills_required);
          const locationText =
            [job.location?.city, job.location?.country]
              .filter(Boolean)
              .join(', ') || 'Remote';

          return (
            <li key={job.id}>
              <Link
                to={`/jobs/${job.id}`}
                className="block border border-outline-variant/60 rounded-lg p-3 hover:border-primary/40 hover:shadow-sm transition-all group h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="size-8 rounded-md bg-surface-container-high text-outline flex items-center justify-center shrink-0">
                    <Briefcase size={14} />
                  </span>
                  <span className="text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {job.title}
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
