
import { ArrowUpRight, Building2, Link as LinkIcon, Mail, MessageCircle, } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { JobEmployer } from '../../jobTypes';
import {
  employerDisplayName,
  employerLogo,
} from '../../utils/formatJob';

interface Props {
  employer: JobEmployer;
  thumbnail: string | null;
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-container rounded-lg p-4">
      <p className="text-label-md font-medium text-on-surface-variant">
        {label}
      </p>
      <p className="text-body-md font-bold text-on-surface">
        {value}
      </p>
    </div>
  );
}

function locationLabel(
  location: JobEmployer['location']
) {
  if (!location) return null;
  if (typeof location === 'string') return location;

  return (
    [location.city, location.country]
      .filter(Boolean)
      .join(', ') || null
  );
}

function EmployerCard({
  employer,
  thumbnail,
}: Props) {
  const level = employer.access_level;
  const displayName = employerDisplayName({
    employer,
  });
  const logo = employerLogo({
    employer,
    thumbnail,
  });
  const location = locationLabel(
    employer.location
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-headline-md font-bold text-on-surface">
          About the Employer
        </h2>

        <Link
          to={`/profile/${employer.username}`}
          className="inline-flex items-center gap-1 text-body-md font-medium text-primary hover:underline shrink-0">
          View Profile <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/50 shrink-0">
          {logo ? (
            <img
              src={logo}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-body-lg font-bold text-on-surface">
            {displayName}
          </p>

          {employer.is_verified && (
            <span className="text-label-sm text-primary font-medium">
              Verified employer
            </span>
          )}
        </div>

        {employer.id && employer.username && (
          <Link
            to={`/messages?userId=${employer.id}&username=${employer.username}&profile_picture=${employer.profile_picture ?? ''}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all shrink-0"
          >
            <MessageCircle size={18} />
            Chat
          </Link>
        )}
      </div>

      {level === 'private' ? (
        <p className="text-body-md text-on-surface-variant">
          This employer keeps their profile private.
          Apply to the job to get in touch.
        </p>
      ) : (
        <>
          {employer.bio && (
            <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
              {employer.bio}
            </p>
          )}

          {(employer.industry ||
            employer.employees_count != null ||
            location) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employer.industry && (
                <InfoBlock
                  label="Industry"
                  value={employer.industry}
                />
              )}

              {employer.employees_count != null && (
                <InfoBlock
                  label="Company Size"
                  value={`${employer.employees_count}+ employees`}
                />
              )}

              {location &&
                level !== 'limited' && (
                  <InfoBlock
                    label="Location"
                    value={location}
                  />
                )}
            </div>
          )}

          {level === 'full' &&
            employer.email && (
              <div className="mt-4">
                <a
                  href={`mailto:${employer.email}`}
                  className="flex items-center gap-1 text-primary hover:underline text-body-md"
                >
                  <Mail size={16} />
                  {employer.email}
                </a>
              </div>
            )}

          {employer.social_links &&
            (level === 'full' ||
              level === 'public') && (
              <div className="mt-4 flex gap-3">
                {Object.entries(
                  employer.social_links
                )
                  .filter(
                    ([, url]) => !!url
                  )
                  .map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={key}
                      className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                    >
                      <LinkIcon size={16} />
                    </a>
                  ))}
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default EmployerCard;