import { JobDetails, JobDetailsSkeleton } from '@/features/jobs/';
import { useGetJobDetailQuery } from '@/features/jobs/jobApi';
import { useParams } from 'react-router-dom';

import NotFound from '@/components/ui/NotFound';

function JobDetailsPage() {
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
        title="Job not found"
        message="The job you're looking for doesn't exist or has been removed."
        actionLabel="Back to Jobs"
        actionTo="/jobs"
      />
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <JobDetails job={job} />
    </div>
  );
}

export default JobDetailsPage;
