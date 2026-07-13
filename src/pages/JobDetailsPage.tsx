import { useCallback } from 'react';

import { JobDetails, JobDetailsSkeleton } from '@/features/jobs/';
import {
  useGetJobDetailQuery,
  useSaveJobMutation,
  useUnsaveJobMutation,
} from '@/features/jobs/jobApi';
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
  const [saveJob] = useSaveJobMutation();
  const [unsaveJob] = useUnsaveJobMutation();

  const handleSaveToggle = useCallback(async () => {
    if (!job) return;

    if (job.is_saved) {
      await unsaveJob(job.id);
      return;
    }

    await saveJob({ job_id: job.id });
  }, [job, saveJob, unsaveJob]);

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
      <JobDetails job={job} onSaveToggle={handleSaveToggle} />
    </div>
  );
}

export default JobDetailsPage;
