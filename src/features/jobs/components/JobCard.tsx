import { Briefcase, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  isUrgent?: boolean;
  logo?: string;
}

function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  isUrgent = false,
  logo,
}: JobCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <div className="w-14 h-14 bg-surface-container-high rounded-lg flex items-center justify-center border border-outline-variant/50">
            {logo ? (
              <img
                src={logo}
                alt={`${company} logo`}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Briefcase className="w-6 h-6 text-primary" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                <Link
                  to={`/jobs/${id}`}
                  className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm"
                >
                  {title}
                </Link>
              </h3>
              <p className="text-body-md font-medium text-primary">{company}</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="text-body-md font-bold text-on-surface">{salary}</span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error/10 text-error text-label-md font-bold rounded-full">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"
                    aria-hidden="true"
                  />
                  <span>Urgent</span>
                </span>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap gap-4 text-body-md text-on-surface-variant">
            <div className="flex items-center gap-1">
              <MapPin size={16} className="shrink-0" aria-hidden="true" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="shrink-0" aria-hidden="true" />
              <span>{postedAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase size={16} className="shrink-0" aria-hidden="true" />
              <span>{type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Button */}
      <Link
        to={`/jobs/${id}`}
        className="mt-4 inline-block w-full sm:w-auto px-4 py-2 text-center text-body-md font-medium text-primary border border-outline-variant rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
        aria-label={`View details for ${title} at ${company}`}
      >
        View Details
      </Link>
    </div>
  );
}

export default JobCard;