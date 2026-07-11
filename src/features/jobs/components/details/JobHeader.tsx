import { Building2, Clock, Heart, MapPin, Share2 } from 'lucide-react';

import type { JobDetail } from '../../jobTypes';
import {
  employerDisplayName,
  employerLogo,
  formatDate,
  titleCase,
} from '../../utils/formatJob';

const STATUS_TONE: Record<string, string> = {
  open: 'bg-success/10 text-success',
  urgent: 'bg-error/10 text-error',
  closed: 'bg-outline-variant/50 text-on-surface-variant',
  filled: 'bg-outline-variant/50 text-on-surface-variant',
  draft: 'bg-warning/10 text-warning',
};

interface Props {
  job: JobDetail;
}

function JobHeader({ job }: Props) {
  const { title, status, created_at, location, employer } = job;
  const companyName = employerDisplayName(job);
  const logo = employerLogo(job);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="shrink-0">
          <div className="w-20 h-20 bg-surface-container-high rounded-xl flex items-center justify-center border border-outline-variant/50 overflow-hidden">
            {logo ? (
              <img
                src={logo}
                alt={companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-10 h-10 text-primary" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-headline-lg font-bold text-on-surface">
              {title}
            </h1>
            {employer.is_verified && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-label-md font-medium rounded-full">
                Verified
              </span>
            )}

            <span
              className={`px-2 py-0.5 text-label-md font-medium rounded-full ${
                STATUS_TONE[status] ??
                'bg-outline-variant/50 text-on-surface-variant'
              }`}>
              {titleCase(status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-body-md text-on-surface-variant">
            <span className="font-medium text-primary">{companyName}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />

            <div className="flex items-center gap-1">
              <MapPin size={16} className="shrink-0" />
              <span>
                {[location?.city, location?.country]
                  .filter(Boolean)
                  .join(', ') || 'Remote'}
              </span>
            </div>

            <span className="w-1 h-1 rounded-full bg-outline-variant" />

            <div className="flex items-center gap-1">
              <Clock size={16} className="shrink-0" />
              <span>Posted: {formatDate(created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <Heart size={20} />
          </button>
          <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobHeader;
