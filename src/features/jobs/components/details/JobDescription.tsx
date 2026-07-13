import type { JobDetail } from '../../jobTypes';
import { formatDate, titleCase } from '../../utils/formatJob';

interface Props {
  job: JobDetail;
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container rounded-lg p-4 min-w-0">
      <p className="text-label-md font-medium text-on-surface-variant mb-1">
        {label}
      </p>
      <p className="text-body-md font-bold text-on-surface leading-snug">
        {value}
      </p>
    </div>
  );
}

function JobDescription({ job }: Props) {
  const {
    description,
    job_type,
    work_mode,
    experience_level,
    experience_years,
    deadline,
  } = job;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-headline-md font-bold text-on-surface">
            Job description
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-label-md font-medium text-on-surface-variant">
            {titleCase(job_type)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-label-md font-medium text-on-surface-variant">
            {titleCase(work_mode)}
          </span>
        </div>

        <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetaBlock
          label="Experience"
          value={`${titleCase(experience_level)} • ${experience_years}+ yrs`}
        />
        <MetaBlock label="Deadline" value={formatDate(deadline)} />
      </div>
    </div>
  );
}

export default JobDescription;
