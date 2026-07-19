import { Briefcase, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { JobResult } from '../jobTypes';

type Props = {
  job: JobResult;
};

function getLocation(job: JobResult) {
  if (!job.location) return 'Remote';

  return (
    [
      job.location.city,
      job.location.state,
      job.location.country,
    ]
      .filter(Boolean)
      .join(', ') || 'Remote'
  );
}

function getJobType(type: string) {
  const labels: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    internship: 'Internship',
    freelance: 'Freelance',
    contract: 'Contract',
  };

  return labels[type] ?? type;
}

export default function ProfileRecentJobCard({
  job,
}: Props) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-outline-variant
        bg-surface-container-lowest
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-md
      ">
      {/* Thumbnail */}

      {job.thumbnail ? (
        <img
          src={job.thumbnail}
          alt={job.title}
          className="h-28 w-full object-cover"
        />
      ) : (
        <div className="flex h-28 items-center justify-center bg-surface-container">
          <Briefcase
            size={34}
            className="text-outline"
          />
        </div>
      )}

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-on-surface group-hover:text-primary">
          {job.title}
        </h3>

        <p className="line-clamp-1 text-xs text-on-surface-variant">
          {job.title}
        </p>

        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
          <MapPin size={13} />
          <span className="truncate">
            {getLocation(job)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-label font-medium text-primary">
            {getJobType(job.job_type)}
          </span>

          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
            <Users size={13} />
            {job.total_applications}
          </div>
        </div>
      </div>
    </Link>
  );
}