import { useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import ApplicationStatusBadge from '@/features/dashboard/components/myApplications/ApplicationStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import CoverLetterPreview from '@/features/jobs/components/CoverLetterPreview';
import ResumeField from '@/features/jobs/components/ResumeField';
import {
  useDeleteJobApplicationMutation,
  useGetJobApplicationDetailQuery,
  useWithdrawJobApplicationMutation,
} from '@/features/jobs/jobApi';
import {
  ArrowLeft,
  Briefcase,
  ShieldAlert,
  Trash2,
  Undo2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import NotFound from '@/components/ui/NotFound';

import { useAppSelector } from '@/hooks/useSelectore';

const NON_WITHDRAWABLE_STATUSES = new Set(['rejected', 'withdrawn']);

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
        Only the applicant who submitted this application can view it here.
      </p>
      <Link
        to="/dashboard/my-applications"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Applications
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

export default function ManageApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);

  const {
    data: application,
    isLoading,
    isError,
    refetch,
  } = useGetJobApplicationDetailQuery(id ?? '', { skip: !id });
  const [withdrawApplication, { isLoading: isWithdrawing }] =
    useWithdrawJobApplicationMutation();
  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteJobApplicationMutation();

  const [confirmAction, setConfirmAction] = useState<
    'withdraw' | 'delete' | null
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
      <NotFound
        title="Application not found"
        message="This application doesn't exist or has been removed."
        actionLabel="Back to My Applications"
        actionTo="/dashboard/my-applications"
      />
    );
  }

  if (currentUser && application.applicant.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const canWithdraw = !NON_WITHDRAWABLE_STATUSES.has(application.status);

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(application.id).unwrap();
      toast.success('Application withdrawn');
      setConfirmAction(null);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Couldn't withdraw this application.")
      );
      setConfirmAction(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(application.id).unwrap();
      toast.success('Application deleted');
      navigate('/dashboard/my-applications');
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't delete this application."));
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/dashboard/my-applications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to My Applications
        </Link>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {/* Job info */}
      <Card>
        <Link
          to={`/jobs/${application.job.id}`}
          className="flex items-center gap-4 group">
          <div className="size-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
            {application.job.thumbnail ? (
              <img
                src={application.job.thumbnail}
                alt={application.job.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase size={24} />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
              {application.job.title}
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              View job posting
            </p>
          </div>
        </Link>
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
            value={<ResumeField resumeUrl={application.resume} />}
          />
        </div>

        <div className="border-t border-outline-variant/40 pt-4">
          <Field
            label="Cover Letter"
            value={<CoverLetterPreview html={application.cover_letter} />}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="border border-outline-variant bg-surface-container-lowest rounded-lg p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-body-md text-on-surface-variant ">
          This application has already been submitted and can no longer be
          edited. You can withdraw it or remove it from your applications.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {canWithdraw && (
            <button
              type="button"
              onClick={() => setConfirmAction('withdraw')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant text-on-surface rounded-lg font-medium hover:bg-surface-container transition-all cursor-pointer">
              <Undo2 size={16} />
              Withdraw
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmAction('delete')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {confirmAction === 'withdraw' && (
        <ConfirmDialog
          title="Withdraw this application?"
          description={`You'll withdraw your application for "${application.job.title}". The employer will be notified and this cannot be undone.`}
          confirmLabel="Withdraw Application"
          isConfirming={isWithdrawing}
          onConfirm={() => void handleWithdraw()}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction === 'delete' && (
        <ConfirmDialog
          title="Delete this application?"
          description={`Your application for "${application.job.title}" will be permanently removed from your applications. This action cannot be undone.`}
          confirmLabel="Delete Application"
          isConfirming={isDeleting}
          onConfirm={() => void handleDelete()}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
