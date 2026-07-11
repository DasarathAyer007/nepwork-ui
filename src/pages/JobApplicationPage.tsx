import { JobDetailsSkeleton } from '@/features/jobs';
import JobApplicationForm from '@/features/jobs/components/JobApplicationForm';
import { useGetJobDetailQuery } from '@/features/jobs/jobApi';
import { Link, useParams } from 'react-router-dom';

function NotFound() {
  return (
    <div className="bg-background min-h-screen pt-20 pb-16 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-headline-lg font-bold text-on-surface">
        Job Not Found
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2 mb-4">
        The job you are trying to apply for does not exist.
      </p>
      <Link
        to="/jobs"
        className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium">
        Back to Jobs
      </Link>
    </div>
  );
}

function JobApplicationPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: job,
    isLoading,
    isError,
  } = useGetJobDetailQuery(id ?? '', {
    skip: !id,
  });

  if (isLoading) return <JobDetailsSkeleton />;
  if (isError || !job) return <NotFound />;

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <JobApplicationForm
        jobId={job.id}
        jobTitle={job.title}
        company={job.category?.name ?? 'General'}
        location={
          [
            job.location?.address,
            job.location?.city,
            job.location?.state,
            job.location?.country,
          ]
            .filter(Boolean)
            .join(', ') || 'Location not specified'
        }
        salary={
          job.salary_min || job.salary_max
            ? `${job.salary_min ?? ''} - ${job.salary_max ?? ''} ${
                job.currency ?? ''
              }`
            : 'Negotiable'
        }
        jobType={job.job_type}
        postedAt={job.created_at}
        employerName={job.employer?.full_name}
        employerEmail={job.employer?.email}
        employerUsername={job.employer?.username}
      />
    </div>
  );
}

export default JobApplicationPage;
