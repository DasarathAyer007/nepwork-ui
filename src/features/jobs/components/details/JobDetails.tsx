import type { JobDetail } from '../../jobTypes';
import EmployerCard from './EmployerCard';
import JobApplyCard from './JobApplyCard';
import JobDescription from './JobDescription';
import JobHeader from './JobHeader';
import JobLocationMap from './JobLocationMap';
import JobRequirementsBenefits from './JobRequirementsBenefits';
import JobSkills from './JobSkills';

interface Props {
  job: JobDetail;
}

function JobDetails({ job }: Props) {
  const { location } = job;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <JobHeader job={job} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 space-y-6">
            <JobDescription job={job} />
            <JobSkills skills={job.skills_required} />
          </div>

          <JobRequirementsBenefits requirements={job.requirements} benefits={job.benefits} />

          <EmployerCard employer={job.employer} thumbnail={job.thumbnail} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <JobApplyCard job={job} />

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h3 className="text-headline-sm font-bold text-on-surface mb-4">Location</h3>
            {location?.point?.lat && location?.point?.lng ? (
            <JobLocationMap
              latitude={location.point?.lat ?? null}
              longitude={location.point?.lng ?? null}
              address={location.address}
              label={location.label ?? job.title}
            />) : (
              <div className="h-[220px] flex flex-col items-center justify-center gap-2 bg-surface-container rounded-lg text-on-surface-variant">
                <p className="text-body-sm">Location not available</p>
              </div>
            )}
            {(location?.city || location?.country) && (
              <p className="text-body-sm text-on-surface-variant mt-3">
                {[location.address, location.city, location.state, location.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;