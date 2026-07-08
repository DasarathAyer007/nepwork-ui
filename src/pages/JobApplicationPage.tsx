import { Link, useParams } from 'react-router-dom';

import JobApplicationForm from '../features/jobs/components/JobApplicationForm.tsx';

// Same mock data as JobDetails.tsx to ensure perfect matching
const JOBS_MOCK = [
  {
    id: '1',
    title: 'Senior Agronomist',
    company: 'GreenTerra Solutions',
    location: 'Pokhara, Nepal',
    salary: '85,000 - 120,000',
    type: 'Full-time',
    postedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Full-Stack Developer (React/Node)',
    company: 'Nepal Digital Labs',
    location: 'Kathmandu, Remote Friendly',
    salary: '150,000 - 200,000',
    type: 'Contract',
    postedAt: '1 day ago',
  },
];

function JobApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const job = JOBS_MOCK.find((job) => job.id === id);

  if (!job) {
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

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <JobApplicationForm
        jobTitle={job.title}
        company={job.company}
        location={job.location}
        salary={job.salary}
        jobType={job.type}
        postedAt={job.postedAt}
      />
    </div>
  );
}

export default JobApplicationPage;
