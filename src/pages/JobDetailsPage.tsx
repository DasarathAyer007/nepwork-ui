import { Link, useParams } from 'react-router-dom';

import {JobDetails,JobDetailsSkeleton} from '@/features/jobs/';
import { useGetJobDetailQuery } from '@/features/jobs/jobApi';

function NotFound() {
  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center py-20">
        <h1 className="text-headline-lg font-bold text-on-surface">Job not found</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          The job you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/jobs"
          className="mt-4 inline-block px-6 py-2 bg-primary text-on-primary rounded-lg font-medium">
          Back to Jobs
        </Link>
      </div>
    </div>
  );
}

function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useGetJobDetailQuery(id ?? '', {
    skip: !id,
  });

  if (isLoading) return <JobDetailsSkeleton />;
  if (isError || !job) return <NotFound />;

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <JobDetails job={job} />
    </div>
  );
}

export default JobDetailsPage;