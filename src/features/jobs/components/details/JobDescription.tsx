import type { JobDetail } from '../../jobTypes';
import { formatDate, titleCase } from '../../utils/formatJob';

interface Props {
  job: JobDetail;
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container rounded-lg p-4">
      <p className="text-label-md font-medium text-on-surface-variant">
        {label}
      </p>
      <p className="text-body-md font-bold text-on-surface">{value}</p>
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
      <h2 className="text-headline-md font-bold text-on-surface mb-4">
        Job description
      </h2>
      <p className="text-body-md text-on-surface-variant leading-relaxed mb-6 whitespace-pre-line">
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetaBlock label="Job Type" value={titleCase(job_type)} />
        <MetaBlock label="Work Mode" value={titleCase(work_mode)} />
        <MetaBlock
          label="Experience Level"
          value={`${titleCase(experience_level)} (${experience_years}+ yrs)`}
        />
        <MetaBlock label="Deadline" value={formatDate(deadline)} />
      </div>
    </div>
  );
}

export default JobDescription;
