import { useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import ApplicationStatusBadge from '@/features/dashboard/components/myApplications/ApplicationStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import {
  useGetJobApplicationDetailQuery,
  useMarkInterviewedJobApplicationMutation,
  useMarkUnderReviewJobApplicationMutation,
  useOfferJobApplicationMutation,
  useRejectJobApplicationMutation,
  useScheduleInterviewJobApplicationMutation,
  useShortlistJobApplicationMutation,
} from '@/features/jobs/jobApi';
import type { ApplicationStatus } from '@/features/jobs/jobTypes';
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

import { useAppSelector } from '@/hooks/useSelectore';

const FORWARD_ACTIONS: Partial<
  Record<ApplicationStatus, { mutationKey: string; label: string }>
> = {
  applied: { mutationKey: 'shortlist', label: 'Shortlist Candidate' },
  shortlisted: { mutationKey: 'under_review', label: 'Move to Under Review' },
  under_review: {
    mutationKey: 'schedule_interview',
    label: 'Schedule Interview',
  },
  interview_scheduled: {
    mutationKey: 'mark_interviewed',
    label: 'Mark as Interviewed',
  },
  interviewed: { mutationKey: 'offer', label: 'Extend Offer' },
};

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <AlertTriangle size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">
        Application not found
      </h1>
      <Link
        to="/dashboard/jobs"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Jobs
      </Link>
    </div>
  );
}

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

  const [shortlist, { isLoading: isShortlisting }] =
    useShortlistJobApplicationMutation();
  const [markUnderReview, { isLoading: isMarkingUnderReview }] =
    useMarkUnderReviewJobApplicationMutation();
  const [scheduleInterview, { isLoading: isSchedulingInterview }] =
    useScheduleInterviewJobApplicationMutation();
  const [markInterviewed, { isLoading: isMarkingInterviewed }] =
    useMarkInterviewedJobApplicationMutation();
  const [offer, { isLoading: isOffering }] = useOfferJobApplicationMutation();
  const [reject, { isLoading: isRejecting }] =
    useRejectJobApplicationMutation();

  const [confirmAction, setConfirmAction] = useState<
    'advance' | 'reject' | null
  >(null);

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
      <NotFound />
    );
  }

  if (currentUser && application.job.posted_by !== currentUser.id) {
    return <AccessDenied />;
  }

  const forwardAction = FORWARD_ACTIONS[application.status];
  const isMutating =
    isShortlisting ||
    isMarkingUnderReview ||
    isSchedulingInterview ||
    isMarkingInterviewed ||
    isOffering ||
    isRejecting;

  const runMutation = async (
    mutationKey: string,
    successMessage: string,
    fallbackError: string
  ) => {
    try {
      const mutation = {
        shortlist,
        under_review: markUnderReview,
        schedule_interview: scheduleInterview,
        mark_interviewed: markInterviewed,
        offer,
        reject,
      }[mutationKey];
      if (!mutation) return;
      await mutation(application.id).unwrap();
      toast.success(successMessage);
      setConfirmAction(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, fallbackError));
      setConfirmAction(null);
    }
  };

  const handleAdvance = () => {
    if (!forwardAction) return;
    return runMutation(
      forwardAction.mutationKey,
      'Application status updated',
      "Couldn't update this application."
    );
  };

  const handleReject = () =>
    runMutation(
      'reject',
      'Application rejected',
      "Couldn't reject this application."
    );

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
              {application.applicant.full_name ||
                application.applicant.username}
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
              application.resume ? (
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
                  <Download size={15} />
                  Download resume
                </a>
              ) : (
                'Not attached'
              )
            }
          />
        </div>

        <div className="border-t border-outline-variant/40 pt-4">
          <Field
            label="Cover Letter"
            value={
              application.cover_letter ? (
                <p className="whitespace-pre-line text-on-surface-variant">
                  {application.cover_letter}
                </p>
              ) : (
                'No cover letter added'
              )
            }
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
        <p className="text-body-md text-on-surface-variant max-w-lg">
          {forwardAction
            ? 'Move this candidate forward in your hiring pipeline, or reject the application.'
            : 'This application has reached a final stage — no further status changes are available here.'}
        </p>
        {forwardAction && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmAction('reject')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
              <X size={16} />
              Reject
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction('advance')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all cursor-pointer">
              {forwardAction.label}
            </button>
          </div>
        )}
      </div>

      {confirmAction === 'advance' && forwardAction && (
        <ConfirmDialog
          title={`${forwardAction.label}?`}
          description={`${
            application.applicant.full_name || application.applicant.username
          }'s application will move to the next stage.`}
          confirmLabel={forwardAction.label}
          isConfirming={isMutating}
          onConfirm={() => void handleAdvance()}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'reject' && (
        <ConfirmDialog
          title="Reject this application?"
          description={`${
            application.applicant.full_name || application.applicant.username
          }'s application will be marked as rejected. This cannot be undone.`}
          confirmLabel="Reject Application"
          isConfirming={isMutating}
          onConfirm={() => void handleReject()}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
