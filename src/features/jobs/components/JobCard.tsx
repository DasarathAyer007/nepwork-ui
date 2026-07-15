import {
  BookmarkCheck,
  BookmarkPlus,
  Briefcase,
  Clock,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';

import type { BasicJobCategory, JobResult } from '../jobTypes';

interface JobCardProps {
  data: JobResult;
  onSaveToggle: (data: JobResult) => void;
  maxSkillsShown?: number;
}

const buildLocation = (loc: JobResult['location']) => {
  if (!loc) return 'Remote';
  return (
    [loc.address, loc.city, loc.state, loc.country]
      .filter(Boolean)
      .join(', ') || 'Remote'
  );
};

const getCategoryIcon = (category: BasicJobCategory | null) => {
  if (!category) return null;
  return <CategoryIcon iconname={category.icon} />;
};

const formatSalary = (
  min: string | null,
  max: string | null,
  currency: string
) => {
  if (!min && !max) return 'Salary not specified';

  const minNum = min ? parseFloat(min) : null;
  const maxNum = max ? parseFloat(max) : null;

  if (minNum && maxNum) {
    return `${currency} ${minNum.toLocaleString()} - ${maxNum.toLocaleString()}`;
  }
  if (minNum) {
    return `${currency} ${minNum.toLocaleString()}+`;
  }
  if (maxNum) {
    return `${currency} ${maxNum.toLocaleString()}`;
  }
  return 'Salary not specified';
};

const getExperienceLabel = (level: string, years: number | null) => {
  if (years !== null) {
    return `${years}+ years`;
  }
  const labels: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior',
    lead: 'Lead',
    manager: 'Manager',
  };
  return labels[level] || level;
};

const getJobTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
    freelance: 'Freelance',
  };
  return labels[type] || type;
};

const getWorkModeLabel = (mode: string) => {
  const labels: Record<string, string> = {
    REMOTE: 'Remote',
    ONSITE: 'On-site',
    HYBRID: 'Hybrid',
  };
  return labels[mode] || mode;
};

const getStatusBadge = (status: string) => {
  const config: Record<string, { color: string; label: string }> = {
    OPEN: { color: 'bg-green-500/90 text-white', label: 'Open' },
    CLOSED: { color: 'bg-error/90 text-white', label: 'Closed' },
    DRAFT: {
      color: 'bg-surface-container-high text-on-surface-variant',
      label: 'Draft',
    },
    PAUSED: { color: 'bg-warning/90 text-white', label: 'Paused' },
  };
  return (
    config[status] || {
      color: 'bg-surface-container-high text-on-surface-variant',
      label: status,
    }
  );
};

export default function JobCard({
  data,
  onSaveToggle,
  maxSkillsShown = 3,
}: JobCardProps) {
  const locationText = buildLocation(data.location);
  const salaryText = formatSalary(
    data.salary_min,
    data.salary_max,
    data.currency
  );
  const experienceLabel = getExperienceLabel(
    data.experience_level,
    data.experience_years
  );
  const statusBadge = getStatusBadge(data.status);
  const isOpen = data.status === 'open';

  const visibleSkills = data.skills_required.slice(0, maxSkillsShown);
  const extraSkillsCount = data.skills_required.length - visibleSkills.length;

  return (
    <div className="group relative flex gap-3 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg hover:shadow-md hover:border-primary/30 transition-all duration-200">
      {/* Thumbnail / Logo */}
      <Link
        to={`/jobs/${data.id}`}
        className="relative w-32 sm:w-36 aspect-3/2 self-start rounded-md overflow-hidden shrink-0 border border-outline-variant/60 bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20">
        {data.thumbnail ? (
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <Briefcase className="w-8 h-8" />
          </div>
        )}
        <span
          className={`absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none ${statusBadge.color}`}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOpen ? 'bg-white' : 'bg-outline'
            }`}
          />
          {statusBadge.label}
        </span>
      </Link>

      {/* Content */}
      <div className="grow min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          {data.category ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="material-symbols-outlined text-primary text-sm shrink-0">
                {getCategoryIcon(data.category)}
              </span>
              <span className="text-label-md font-bold text-primary uppercase tracking-wider truncate">
                {data.category.name}
              </span>
            </div>
          ) : (
            <span />
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              onSaveToggle(data);
            }}
            className={`shrink-0 inline-flex items-center justify-center rounded-full border p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              data.is_saved
                ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
            }`}
            aria-pressed={data.is_saved}
            aria-label={data.is_saved ? 'Remove from saved jobs' : 'Save job'}>
            {data.is_saved ? (
              <BookmarkCheck className="w-5 h-5 fill-current text-primary" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-title-md font-bold text-on-surface leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          <Link
            to={`/jobs/${data.id}`}
            className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-sm">
            {data.title}
          </Link>
        </h3>

        {/* Meta row: job type, work mode, location, experience */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-1 min-w-0">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{getJobTypeLabel(data.job_type)}</span>
          </div>

          <div className="flex items-center gap-1 min-w-0">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{getWorkModeLabel(data.work_mode)}</span>
          </div>

          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>

          {experienceLabel && (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-outline">•</span>
              <span className="truncate">{experienceLabel}</span>
            </div>
          )}

          {data.deadline && (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-outline">•</span>
              <span className="truncate">
                Deadline: {new Date(data.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {visibleSkills.map((skillName) => (
              <span
                key={skillName}
                className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-label-sm">
                {skillName}
              </span>
            ))}
            {extraSkillsCount > 0 && (
              <span className="text-label-sm text-outline px-1">
                +{extraSkillsCount} more
              </span>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-1.5 border-t border-outline-variant/40">
          <span className="text-body-sm text-on-surface-variant">
            {data.total_applications}{' '}
            {data.total_applications === 1 ? 'application' : 'applications'}
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-label-sm text-outline">Salary</span>
            <span className="text-title-md font-bold text-primary leading-none">
              {salaryText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
