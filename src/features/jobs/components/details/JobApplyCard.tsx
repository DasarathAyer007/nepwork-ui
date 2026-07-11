import { FileText, Link as LinkIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { JobDetail } from '../../jobTypes';
import { formatSalaryRange, titleCase } from '../../utils/formatJob';

interface Props {
  job: JobDetail;
}

function JobApplyCard({ job }: Props) {
  const {
    id,
    salary_min,
    salary_max,
    currency,
    job_type,
    work_mode,
    contact_email,
    contact_phone,
  } = job;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
      <Link
        to={`/jobs/${id}/apply`}
        className="block w-full py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all duration-200 active:scale-95 text-center">
        Apply Now
      </Link>

      {/* <div className="mt-4 border-2 border-dashed border-outline-variant rounded-lg p-6 text-center">
        <FileText size={32} className="mx-auto text-on-surface-variant mb-2" />
        <p className="text-body-md font-medium text-on-surface">Upload Resume</p>
        <p className="text-label-md text-on-surface-variant">PDF, DOCX (Max 5MB)</p>
      </div> */}

      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center text-body-md">
          <span className="text-on-surface-variant">Salary Range</span>
          <span className="font-medium text-on-surface">
            {formatSalaryRange(salary_min, salary_max, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center text-body-md">
          <span className="text-on-surface-variant">Job Type</span>
          <span className="font-medium text-on-surface">
            {titleCase(job_type)}
          </span>
        </div>
        <div className="flex justify-between items-center text-body-md">
          <span className="text-on-surface-variant">Work Mode</span>
          <span className="font-medium text-on-surface">
            {titleCase(work_mode)}
          </span>
        </div>
      </div>

      {(contact_email || contact_phone) && (
        <div className="mt-4 pt-4 border-t border-outline-variant/50 space-y-2">
          {contact_email && (
            <a
              href={`mailto:${contact_email}`}
              className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-primary">
              <Mail size={16} /> {contact_email}
            </a>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-outline-variant/50">
        <p className="text-label-md font-medium text-on-surface-variant mb-3">
          SHARE THIS ROLE
        </p>
        <div className="flex gap-2">
          <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <LinkIcon size={18} />
          </button>
          <button className="p-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
            <Mail size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobApplyCard;
