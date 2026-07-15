import {
  BookmarkCheck,
  BookmarkPlus,
  Briefcase,
  Clock,
  MapPin,
  Share2,
} from 'lucide-react';

import type { ServiceDetail } from '../../types';

const STATUS_TONE: Record<string, string> = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-outline-variant/50 text-on-surface-variant',
};

interface Props {
  service: ServiceDetail;
  onSaveToggle: () => void;
}

function ServiceHeader({ service, onSaveToggle }: Props) {
  const location = [service.location?.city, service.location?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Thumbnail */}
        <div className="shrink-0 self-start">
          <div className="w-36 sm:w-44 aspect-3/2 bg-surface-container-high rounded-md flex items-center justify-center border border-outline-variant overflow-hidden">
            {service.thumbnail ? (
              <img
                src={service.thumbnail}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase className="w-10 h-10 text-primary" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-headline-lg font-bold text-on-surface">
              {service.title}
            </h1>

            {service.user?.is_verified && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-label-md font-medium rounded-full">
                Verified
              </span>
            )}

            <span
              className={`px-2 py-0.5 text-label-md font-medium rounded-full ${
                STATUS_TONE[service.status] ??
                'bg-outline-variant/50 text-on-surface-variant'
              }`}>
              {service.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-body-md text-on-surface-variant">
            {service.user && (
              <>
                <span className="font-medium text-primary">
                  {service.user.username}
                </span>

                <span className="w-1 h-1 rounded-full bg-outline-variant" />
              </>
            )}

            <div className="flex items-center gap-1">
              <MapPin size={16} className="shrink-0" />
              <span>{location || 'Remote'}</span>
            </div>

            <span className="w-1 h-1 rounded-full bg-outline-variant" />

            <div className="flex items-center gap-1">
              <Clock size={16} className="shrink-0" />
              <span>
                Posted: {new Date(service.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSaveToggle}
            className={`inline-flex items-center justify-center rounded-full border p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              service.is_saved
                ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
            aria-pressed={service.is_saved}
            aria-label={
              service.is_saved ? 'Remove from saved services' : 'Save service'
            }>
            {service.is_saved ? (
              <BookmarkCheck size={20} className="fill-current" />
            ) : (
              <BookmarkPlus size={20} />
            )}
          </button>

          <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceHeader;
