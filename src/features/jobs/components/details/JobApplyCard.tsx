import { Link as LinkIcon, Mail } from 'lucide-react';
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

  const contactItems = [
    contact_email
      ? {
          label: 'Email',
          value: contact_email,
          href: `mailto:${contact_email}`,
          icon: Mail,
        }
      : null,
    contact_phone
      ? {
          label: 'Phone',
          value: contact_phone,
          href: `tel:${contact_phone}`,
          icon: LinkIcon,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href: string;
    icon: typeof Mail;
  }>;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
      <Link
        to={`/jobs/${id}/apply`}
        className="block w-full py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all duration-200 active:scale-95 text-center">
        Apply Now
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="rounded-lg bg-surface-container p-4">
          <p className="text-label-md font-medium text-on-surface-variant mb-1">
            Salary Range
          </p>
          <p
            className="text-body-md font-semibold text-on-surface">
            {formatSalaryRange(salary_min, salary_max, currency)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-surface-container p-4 min-w-0">
            <p className="text-label-md font-medium text-on-surface-variant mb-1">
              Job Type
            </p>
            <p
              className="text-body-md font-semibold text-on-surface"
            >
              {titleCase(job_type)}
            </p>
          </div>

          <div className="rounded-lg bg-surface-container p-4 min-w-0">
            <p className="text-label-md font-medium text-on-surface-variant mb-1">
              Work Mode
            </p>
            <p
              className="text-body-md font-semibold text-on-surface"
            >
              {titleCase(work_mode)}
            </p>
          </div>
        </div>
      </div>

      {contactItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-outline-variant/50 space-y-2">
          <p className="text-label-md font-medium text-on-surface-variant">
            Contact
          </p>
          <div className="space-y-2">
            {contactItems.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-body-md text-on-surface-variant hover:bg-surface-container hover:text-primary min-w-0">
                <Icon size={16} className="shrink-0" />
                <span className="text-label-md font-medium uppercase tracking-wide shrink-0">
                  {label}
                </span>
                <span className="truncate">{value}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* <div className="mt-6 pt-4 border-t border-outline-variant/50">
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
      </div> */}
    </div>
  );
}

export default JobApplyCard;
