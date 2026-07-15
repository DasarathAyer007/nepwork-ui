import { ArrowRight, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';

import type { JobResult } from '../../jobs/jobTypes';
import { titleCase } from '../../jobs/utils/formatJob';

export type Job = JobResult;

const MAX_TITLE_LENGTH = 42;
const MAX_LOCATION_LENGTH = 28;

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function buildLocation(location: JobResult['location']) {
  if (!location) return 'Remote';
  const text = [location.city, location.country].filter(Boolean).join(', ');
  return truncate(text || 'Remote', MAX_LOCATION_LENGTH);
}

function formatSalary(
  min: string | null,
  max: string | null,
  currency: string
) {
  const fmt = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const minNum = min ? Number(min) : null;
  const maxNum = max ? Number(max) : null;

  if (minNum && maxNum) return `${currency} ${fmt(minNum)} - ${fmt(maxNum)}`;
  if (minNum) return `${currency} ${fmt(minNum)}+`;
  if (maxNum) return `Up to ${currency} ${fmt(maxNum)}`;
  return 'Not specified';
}

function JobCard({ job }: { job: Job }) {
  const employerName = job.organization ?? job.posted_by;

  return (
    <Link
      to={`/jobs/${job.id}`}
      // Removed fixed h-104 to let card grow with content
      className="group flex flex-col w-80 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="p-6 flex flex-col flex-1 min-h-0">
        {/* Top row: category + salary */}
        <div className="flex justify-between items-start gap-2 mb-4">
          {job.category ? (
            <span
              style={{
                backgroundColor: `${job.category.color}1a`,
                color: job.category.color,
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider min-w-0 max-w-[60%]">
              <CategoryIcon
                iconname={job.category.icon}
                size={13}
                color={job.category.color}
              />
              <span className="truncate">{job.category.name}</span>
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-surface-container text-on-surface-variant min-w-0 max-w-[60%] truncate">
              {titleCase(job.job_type)}
            </span>
          )}
          <span className="text-primary font-bold text-sm text-right shrink-0 whitespace-nowrap">
            {formatSalary(job.salary_min, job.salary_max, job.currency)}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors duration-200 leading-snug h-14 overflow-hidden">
          {truncate(job.title, MAX_TITLE_LENGTH)}
        </h4>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-on-surface-variant text-sm mt-1 mb-4">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{buildLocation(job.location)}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Briefcase size={13} />
            {titleCase(job.work_mode)}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-6.5">
          {job.skills_required.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 truncate max-w-32">
              {skill}
            </span>
          ))}
        </div>

        {/* Footer – sits directly after skills, no spacer */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 mt-2">
          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate max-w-44">
              {truncate(employerName, 28)}
            </p>
            <p className="text-xs text-on-surface-variant">
              {job.total_applications}{' '}
              {job.total_applications === 1 ? 'application' : 'applications'}
            </p>
          </div>

          <span className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all duration-200 shrink-0">
            Apply <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
