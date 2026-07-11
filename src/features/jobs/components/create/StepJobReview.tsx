import {
  Briefcase,
  CalendarClock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Tag,
  Wallet,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { JobFormValues } from '../../jobSchema';

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: 'Onsite',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  lead: 'Lead',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  open: 'Open',
  paused: 'Paused',
  closed: 'Closed',
};

export default function StepJobReview() {
  const { watch } = useFormContext<JobFormValues>();
  const values = watch();

  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {values.thumbnail && (
            <img
              src={URL.createObjectURL(values.thumbnail)}
              alt="Job thumbnail"
              className="w-20 h-20 rounded-xl object-cover border border-outline-variant/40 shrink-0 shadow-sm"
            />
          )}
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Preview Mode
            </span>
            <h2 className="text-xl font-bold text-on-surface truncate mt-2">
              {values.title || 'Untitled job'}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1.5 line-clamp-3 leading-relaxed">
              {values.description || 'No description yet.'}
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Key Info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Job Type & Work Mode */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Briefcase size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Job Type & Mode
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {JOB_TYPE_LABELS[values.job_type]} ·{' '}
              {WORK_MODE_LABELS[values.work_mode]}
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Experience Required
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {EXPERIENCE_LABELS[values.experience_level]}
              {values.experience_years != null
                ? ` (${values.experience_years} yrs)`
                : ''}
            </p>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Est. Salary
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {values.salary_min != null || values.salary_max != null
                ? `${values.currency} ${values.salary_min ?? '0'} – ${values.salary_max ?? '—'}`
                : 'Not specified'}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
            <Tag size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Skills Required
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {values.skills_required.length ? (
                values.skills_required.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full border border-outline-variant/20 shadow-sm">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-on-surface-variant">
                  None added
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Location details
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {[
                values.location.city,
                values.location.state,
                values.location.country,
              ]
                .filter(Boolean)
                .join(', ') || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <CalendarClock size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Application Deadline
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {values.deadline || 'No deadline set'}
            </p>
          </div>
        </div>
      </section>

      {/* Requirements & Benefits */}
      {(values.requirements.length > 0 || values.benefits.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.requirements.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20 pb-2">
                Requirements
              </h4>
              <div className="space-y-2">
                {values.requirements.map((r, i) => (
                  <p
                    key={i}
                    className="text-sm text-on-surface leading-relaxed flex items-start gap-2">
                    <span className="font-semibold shrink-0">• {r.key}:</span>
                    <span className="text-on-surface-variant">{r.value}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
          {values.benefits.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20 pb-2">
                Benefits
              </h4>
              <div className="space-y-2">
                {values.benefits.map((b, i) => (
                  <p
                    key={i}
                    className="text-sm text-on-surface leading-relaxed flex items-start gap-2">
                    <span className="font-semibold shrink-0">• {b.key}:</span>
                    <span className="text-on-surface-variant">{b.value}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Footer / Status Summary */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-on-surface leading-relaxed">
            Will be published as{' '}
            <strong className="text-primary font-bold">
              {STATUS_LABELS[values.status]}
            </strong>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
          {values.contact_email && (
            <span className="flex items-center gap-1.5 font-medium bg-surface-container/50 px-3 py-1 rounded-lg border border-outline-variant/20">
              <Mail size={14} className="text-primary" /> {values.contact_email}
            </span>
          )}
          {values.contact_phone && (
            <span className="flex items-center gap-1.5 font-medium bg-surface-container/50 px-3 py-1 rounded-lg border border-outline-variant/20">
              <Phone size={14} className="text-primary" />{' '}
              {values.contact_phone}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
