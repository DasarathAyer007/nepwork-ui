import { useMemo, useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import EmptyState from '@/features/dashboard/components/EmptyState';
import ErrorState from '@/features/dashboard/components/ErrorState';
import JobApplicantsTable from '@/features/dashboard/components/jobApplications/JobApplicantsTable';
import MyApplicationsTableSkeleton from '@/features/dashboard/components/myApplications/MyApplicationsTableSkeleton';
import {
  useGetJobApplicationsQuery,
  useGetJobDetailQuery,
} from '@/features/jobs/jobApi';
import type {
  ApplicationStatus,
  JobApplicationQueryParams,
  JobApplicationResult,
} from '@/features/jobs/jobTypes';
import { AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import Pagination from '@/components/Pagination';
import { DropDown } from '@/components/ui/forms';

import { useAppSelector } from '@/hooks/useSelectore';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const EMPTY_APPLICATIONS: JobApplicationResult[] = [];
const PAGE_SIZE = 20;

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
        Only the owner of this job can view its applicants.
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

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <AlertTriangle size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">
        Job not found
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

export default function JobApplicationsList() {
  const { id: jobId } = useParams<{ id: string }>();
  const currentUser = useAppSelector(selectUser);

  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(1);

  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError,
  } = useGetJobDetailQuery(jobId ?? '', { skip: !jobId });

  const queryParams = useMemo(() => {
    const params: JobApplicationQueryParams = {
      scope: 'received',
      job_id: jobId,
      page,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
    };
    if (status) params.status = status;
    return params;
  }, [jobId, status, page]);

  const {
    data,
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    refetch,
  } = useGetJobApplicationsQuery(queryParams, { skip: !jobId });

  if (isJobLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-surface-container-high rounded-lg" />
        <div className="h-64 bg-surface-container-high rounded-lg" />
      </div>
    );
  }

  if (isJobError || !job) return <NotFound />;

  if (currentUser && job.employer.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const applications = data?.results ?? EMPTY_APPLICATIONS;
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;
  const pageSize = data?.page_size ?? PAGE_SIZE;

  const handleStatusChange = (value: string) => {
    setStatus(value as ApplicationStatus | '');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/dashboard/jobs/${jobId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to Job
        </Link>
        <h1 className="text-headline-md font-bold text-on-surface mt-2">
          Applicants for "{job.title}"
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Review candidates who applied and move them through your hiring
          pipeline.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-64">
            <DropDown
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isApplicationsLoading && <MyApplicationsTableSkeleton />}

      {!isApplicationsLoading && isApplicationsError && (
        <ErrorState
          message="We couldn't load applicants. Please try again."
          onRetry={refetch}
        />
      )}

      {!isApplicationsLoading &&
        !isApplicationsError &&
        applications.length === 0 && (
          <EmptyState
            title="No applicants yet"
            description="Once candidates apply to this job, they'll show up here."
          />
        )}

      {!isApplicationsLoading &&
        !isApplicationsError &&
        applications.length > 0 && (
          <>
            <JobApplicantsTable
              jobId={jobId ?? ''}
              applications={applications}
              page={currentPage}
              pageSize={pageSize}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
    </div>
  );
}
