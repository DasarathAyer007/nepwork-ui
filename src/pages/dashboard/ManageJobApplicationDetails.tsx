import { useEffect, useRef, useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import ApplicationStatusBadge from '@/features/dashboard/components/myApplications/ApplicationStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import CoverLetterPreview from '@/features/jobs/components/CoverLetterPreview';
import ResumeField from '@/features/jobs/components/ResumeField';
import StatusChangeDialog from '@/features/jobs/components/StatusChangeDialog';
import {
  useChangeJobApplicationStatusMutation,
  useGetJobApplicationDetailQuery,
} from '@/features/jobs/jobApi';
import type { ApplicationStatus } from '@/features/jobs/jobTypes';
import {
  ArrowLeft,
  ChevronDown,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import NotFound from '@/components/ui/NotFound';

import { useAppSelector } from '@/hooks/useSelectore';

const TERMINAL_STATUSES = new Set<ApplicationStatus>([
  'rejected',
  'withdrawn',
]);

// Statuses the employer can freely move a candidate to next (excludes
// "rejected", which has its own dedicated action button).
const NEXT_STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'offered', label: 'Offered' },
];

// Statuses that offer the employer the option to send the applicant a
// message (via chat and/or email) — never required, just available.
const MESSAGE_CAPABLE_STATUSES = new Set<ApplicationStatus>([
  'shortlisted',
  'interview_scheduled',
  'offered',
  'rejected',
]);

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  interviewed: 'Interviewed',
  offered: 'Offered',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <ShieldAlert size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">
        You don't have access to this page
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2 max-w-sm">
        Only the job's owner can review this application.
      </p>
      <Link
        to="/dashboard/jobs"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Jobs
      </Link>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 space-y-4">
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-label-md font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </h4>
      <div className="mt-1 text-body-md text-on-surface">{value}</div>
    </div>
  );
}

function NextStatusDropdown({
  options,
  onSelect,
  disabled,
}: {
  options: { value: ApplicationStatus; label: string }[];
  onSelect: (status: ApplicationStatus) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer">
        Next Status
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 bottom-[calc(100%+8px)] w-52 rounded-md border border-outline-variant bg-surface-container-lowest shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setOpen(false);
                onSelect(option.value);
              }}
              className="w-full text-left px-4 py-2.5 text-body-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageJobApplicationDetails() {
  const { id: jobId, applicationId } = useParams<{
    id: string;
    applicationId: string;
  }>();
  const currentUser = useAppSelector(selectUser);

  const {
    data: application,
    isLoading,
    isError,
    refetch,
  } = useGetJobApplicationDetailQuery(applicationId ?? '', {
    skip: !applicationId,
  });

  const [changeStatus, { isLoading: isChangingStatus }] =
    useChangeJobApplicationStatusMutation();

  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-surface-container-high rounded-lg" />
        <div className="h-48 bg-surface-container-high rounded-lg" />
      </div>
    );
  }

  if (isError || !application) {
    return isError ? (
      <ErrorState
        message="We couldn't load this application. Please try again."
        onRetry={refetch}
      />
    ) : (
      <NotFound
        title="Application not found"
        actionLabel="Back to My Jobs"
        actionTo="/dashboard/jobs"
      />
    );
  }

  if (currentUser && application.job.posted_by !== currentUser.id) {
    return <AccessDenied />;
  }

  const isTerminal = TERMINAL_STATUSES.has(application.status);
  const availableNextStatuses = NEXT_STATUS_OPTIONS.filter(
    (option) => option.value !== application.status
  );

  const submitStatusChange = async (
    status: ApplicationStatus,
    message = '',
    sendMessage = true,
    sendEmail = true
  ) => {
    try {
      await changeStatus({
        id: application.id,
        status,
        message,
        send_message: sendMessage,
        send_email: sendEmail,
      }).unwrap();
      toast.success('Application status updated');
      setPendingStatus(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update this application."));
      setPendingStatus(null);
    }
  };

  const applicantName =
    application.applicant.full_name || application.applicant.username;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/dashboard/jobs/${jobId}/applications`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to Applicants
        </Link>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {/* Applicant info */}
      <Card>
        <div className="flex items-center gap-3">
          {application.applicant.profile_picture ? (
            <img
              src={application.applicant.profile_picture}
              alt={application.applicant.username}
              className="size-12 rounded-full object-cover"
            />
          ) : (
            <div className="size-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <User size={20} />
            </div>
          )}
          <div>
            <p className="text-title-md font-bold text-on-surface">
              {applicantName}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Applied for {application.job.title}
            </p>
          </div>
        </div>
      </Card>

      {/* Application details */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Applied On"
            value={new Date(application.created_at).toLocaleDateString(
              undefined,
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          />
          <Field
            label="Expected Salary"
            value={application.expected_salary ?? 'Not specified'}
          />
          <Field
            label="Years of Experience"
            value={
              application.years_of_experience != null
                ? `${application.years_of_experience} years`
                : 'Not specified'
            }
          />
          <Field
            label="Resume"
            value={
              <ResumeField
                resumeUrl={application.resume}
                applicantName={applicantName}
              />
            }
          />
        </div>

        <div className="border-t border-outline-variant/40 pt-4">
          <Field
            label="Cover Letter"
            value={<CoverLetterPreview html={application.cover_letter} />}
          />
        </div>

        {application.notes && (
          <div className="border-t border-outline-variant/40 pt-4">
            <Field
              label="Notes"
              value={
                <p className="whitespace-pre-line text-on-surface-variant">
                  {application.notes}
                </p>
              }
            />
          </div>
        )}
      </Card>

      {/* Status actions */}
      <div className="border border-outline-variant bg-surface-container-lowest rounded-lg p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-body-md text-on-surface-variant ">
          {isTerminal
            ? 'This application has reached a final stage — no further status changes are available here.'
            : 'Move this candidate to any stage in your hiring pipeline, or reject the application.'}
        </p>
        {!isTerminal && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPendingStatus('rejected')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
              <X size={16} />
              Reject
            </button>
            <NextStatusDropdown
              options={availableNextStatuses}
              onSelect={setPendingStatus}
              disabled={isChangingStatus}
            />
          </div>
        )}
      </div>

      {pendingStatus &&
        (MESSAGE_CAPABLE_STATUSES.has(pendingStatus) ? (
          <StatusChangeDialog
            title={`Move to "${STATUS_LABELS[pendingStatus]}"`}
            description={`${applicantName}'s application will be updated to "${STATUS_LABELS[pendingStatus]}".`}
            isSubmitting={isChangingStatus}
            onConfirm={(message, sendMessage, sendEmail) =>
              void submitStatusChange(
                pendingStatus,
                message,
                sendMessage,
                sendEmail
              )
            }
            onCancel={() => setPendingStatus(null)}
          />
        ) : (
          <ConfirmDialog
            title={`Move to "${STATUS_LABELS[pendingStatus]}"?`}
            description={`${applicantName}'s application will be updated to "${STATUS_LABELS[pendingStatus]}".`}
            confirmLabel="Change"
            variant="primary"
            isConfirming={isChangingStatus}
            onConfirm={() => void submitStatusChange(pendingStatus)}
            onCancel={() => setPendingStatus(null)}
          />
        ))}
    </div>
  );
}
