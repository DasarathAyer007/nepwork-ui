import { JobDetailsSkeleton } from '@/features/jobs';
import JobApplicationForm from '@/features/jobs/components/JobApplicationForm';
import { useGetJobDetailQuery } from '@/features/jobs/jobApi';
import { useParams } from 'react-router-dom';

import NotFound from '@/components/ui/NotFound';

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
  if (isError || !job) {
    return (
      <NotFound
        fullScreen
        title="Job Not Found"
        message="The job you are trying to apply for does not exist."
        actionLabel="Back to Jobs"
        actionTo="/jobs"
      />
    );
  }

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
        thumbnail={job.thumbnail}
        employerName={job.employer?.full_name}
        employerEmail={job.employer?.email}
        employerUsername={job.employer?.username}
      />
    </div>
  );
}

export default JobApplicationPage;
