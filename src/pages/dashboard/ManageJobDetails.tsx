import { useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import ErrorState from '@/features/dashboard/components/ErrorState';
import EditableSection from '@/features/dashboard/components/manageJob/EditableSection';
import JobStatusBadge from '@/features/dashboard/components/myJobs/JobStatusBadge';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import { normalizeKeyValueList } from '@/features/dashboard/utils/keyValueList';
import JobCategorySelector from '@/features/jobs/components/create/JobCategorySelector';
import KeyValueListInput from '@/features/jobs/components/create/KeyValueListInput';
import {
  useDeleteJobMutation,
  useGetJobDetailQuery,
  useUpdateJobMutation,
} from '@/features/jobs/jobApi';
import type { JobStatus } from '@/features/jobs/jobTypes';
import type {
  ExperienceLevel,
  JobCreatePayload,
  JobType,
  WorkMode,
} from '@/features/jobs/jobTypes';
import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  ShieldAlert,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';
import SkillsInput from '@/components/SkillsInput';
import MapComponent from '@/components/map/MapComponent';
import NotFound from '@/components/ui/NotFound';
import { DropDown, Input, Label, TextArea } from '@/components/ui/forms';

import { useAppSelector } from '@/hooks/useSelectore';

const JOB_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

const WORK_MODE_OPTIONS = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EXPERIENCE_LEVEL_OPTIONS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead' },
];

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

const CURRENCY_OPTIONS = ['USD', 'NPR', 'INR', 'EUR', 'GBP'].map((c) => ({
  value: c,
  label: c,
}));

type ExperienceDraft = { level: ExperienceLevel; years: string };
type CompensationDraft = {
  salaryMin: string;
  salaryMax: string;
  currency: string;
};
type LocationDraft = {
  lat: number | null;
  lng: number | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};
type ContactDraft = { email: string; phone: string };

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
        Only the owner of this job posting can view and manage its details.
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
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 md:p-6 divide-y divide-outline-variant/40">
      {children}
    </div>
  );
}

export default function ManageJobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectUser);

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useGetJobDetailQuery(id ?? '', { skip: !id });
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDangerZoneOpen, setIsDangerZoneOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-surface-container-high rounded-lg" />
        <div className="h-64 bg-surface-container-high rounded-lg" />
        <div className="h-64 bg-surface-container-high rounded-lg" />
      </div>
    );
  }

  if (isError || !job) {
    return isError ? (
      <ErrorState
        message="We couldn't load this job. Please try again."
        onRetry={refetch}
      />
    ) : (
      <NotFound
        title="Job not found"
        message="The job you're looking for doesn't exist or has been removed."
        actionLabel="Back to My Jobs"
        actionTo="/dashboard/jobs"
      />
    );
  }

  if (currentUser && job.employer.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const runSave = async (
    sectionId: string,
    body: Partial<JobCreatePayload> | FormData,
    successLabel: string
  ) => {
    setSavingId(sectionId);
    setSaveError(null);
    try {
      await updateJob({ id: job.id, body }).unwrap();
      toast.success(`${successLabel} updated`);
      setActiveSection(null);
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    } finally {
      setSavingId(null);
    }
  };

  const sectionError = (sectionId: string) =>
    activeSection === sectionId ? saveError : null;

  const requirements = normalizeKeyValueList(job.requirements);
  const benefits = normalizeKeyValueList(job.benefits);

  const handleDeleteConfirmed = async () => {
    try {
      await deleteJob(job.id).unwrap();
      toast.success('Job deleted');
      navigate('/dashboard/jobs');
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Couldn't delete this job. Please try again.")
      );
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to My Jobs
        </Link>
        <JobStatusBadge status={job.status} />
      </div>

      {/* Hero: thumbnail, title, category */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-6 pb-4">
          <EditableSection<File | null>
            id="thumbnail"
            label="Thumbnail"
            activeId={activeSection}
            onActivate={setActiveSection}
            onDeactivate={() => setActiveSection(null)}
            value={null}
            isSaving={savingId === 'thumbnail'}
            error={sectionError('thumbnail')}
            isEqual={(a) => a === null}
            onSave={(file) => {
              if (!file) return;
              const formData = new FormData();
              formData.append('thumbnail', file);
              return runSave('thumbnail', formData, 'Thumbnail');
            }}
            renderDisplay={() => (
              <div className="size-24 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-outline shrink-0">
                {job.thumbnail ? (
                  <img
                    src={job.thumbnail}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Briefcase size={28} />
                )}
              </div>
            )}
            renderEditor={({ draft, setDraft }) => (
              <div className="w-40">
                {draft ? (
                  <div className="relative size-24 rounded-lg overflow-hidden border border-outline-variant/50">
                    <img
                      src={URL.createObjectURL(draft)}
                      alt="New thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setDraft(null)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-surface-container-lowest/90 text-on-surface hover:text-error transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 size-24 rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary/50 hover:bg-surface-container cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span className="text-label-sm font-medium">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setDraft(e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </div>
            )}
          />

          <div className="flex-1 min-w-0 space-y-1">
            <EditableSection<string>
              id="title"
              label="Job Title"
              activeId={activeSection}
              onActivate={setActiveSection}
              onDeactivate={() => setActiveSection(null)}
              value={job.title}
              isSaving={savingId === 'title'}
              error={sectionError('title')}
              onSave={(title) => runSave('title', { title }, 'Title')}
              renderDisplay={(value) => (
                <h1 className="text-headline-md font-bold text-on-surface">
                  {value}
                </h1>
              )}
              renderEditor={({ draft, setDraft }) => (
                <Input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="e.g., Senior Frontend Engineer"
                />
              )}
            />
          </div>
        </div>

        <EditableSection<string>
          id="category"
          label="Category"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.category?.id ?? ''}
          isSaving={savingId === 'category'}
          error={sectionError('category')}
          onSave={(category) => runSave('category', { category }, 'Category')}
          renderDisplay={() => (
            <div className="flex items-center gap-2 text-body-md text-on-surface">
              {job.category ? (
                <>
                  <CategoryIcon
                    iconname={job.category.icon}
                    size={18}
                    color="currentColor"
                  />
                  <span>{job.category.name}</span>
                </>
              ) : (
                <span className="text-on-surface-variant">Not set</span>
              )}
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <JobCategorySelector value={draft} onChange={setDraft} />
          )}
        />

        <EditableSection<JobStatus>
          id="status"
          label="Status"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.status}
          isSaving={savingId === 'status'}
          error={sectionError('status')}
          onSave={(status) => runSave('status', { status }, 'Status')}
          renderDisplay={(value) => <JobStatusBadge status={value} />}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDraft(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                    draft === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary/40'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </Card>

      {/* Job details */}
      <Card>
        <EditableSection<JobType>
          id="job_type"
          label="Job Type"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.job_type}
          isSaving={savingId === 'job_type'}
          error={sectionError('job_type')}
          onSave={(job_type) => runSave('job_type', { job_type }, 'Job type')}
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {JOB_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <DropDown
              options={JOB_TYPE_OPTIONS}
              value={draft}
              onChange={(e) => setDraft(e.target.value as JobType)}
            />
          )}
        />

        <EditableSection<WorkMode>
          id="work_mode"
          label="Work Mode"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.work_mode}
          isSaving={savingId === 'work_mode'}
          error={sectionError('work_mode')}
          onSave={(work_mode) =>
            runSave('work_mode', { work_mode }, 'Work mode')
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {WORK_MODE_OPTIONS.find((o) => o.value === value)?.label ?? value}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <DropDown
              options={WORK_MODE_OPTIONS}
              value={draft}
              onChange={(e) => setDraft(e.target.value as WorkMode)}
            />
          )}
        />

        <EditableSection<ExperienceDraft>
          id="experience"
          label="Experience"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            level: job.experience_level,
            years:
              job.experience_years != null ? String(job.experience_years) : '',
          }}
          isSaving={savingId === 'experience'}
          error={sectionError('experience')}
          onSave={(draft) =>
            runSave(
              'experience',
              {
                experience_level: draft.level,
                experience_years: draft.years ? Number(draft.years) : undefined,
              },
              'Experience'
            )
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === value.level)
                ?.label ?? value.level}
              {value.years && ` · ${value.years}+ years`}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DropDown
                options={EXPERIENCE_LEVEL_OPTIONS}
                value={draft.level}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    level: e.target.value as ExperienceLevel,
                  })
                }
              />
              <Input
                type="number"
                min={0}
                max={50}
                placeholder="Years of experience"
                value={draft.years}
                onChange={(e) => setDraft({ ...draft, years: e.target.value })}
              />
            </div>
          )}
        />

        <EditableSection<string>
          id="deadline"
          label="Application Deadline"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.deadline ?? ''}
          isSaving={savingId === 'deadline'}
          error={sectionError('deadline')}
          onSave={(deadline) =>
            runSave('deadline', { deadline: deadline || null }, 'Deadline')
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {value ? new Date(value).toLocaleDateString() : 'Not set'}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <Input
              type="date"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
        />
      </Card>

      {/* Description */}
      <Card>
        <EditableSection<string>
          id="description"
          label="Description"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.description}
          isSaving={savingId === 'description'}
          error={sectionError('description')}
          allowEnterToSave={false}
          onSave={(description) =>
            runSave('description', { description }, 'Description')
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface-variant whitespace-pre-line">
              {value}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <TextArea
              autoFocus
              rows={6}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}
        />
      </Card>

      {/* Skills & compensation */}
      <Card>
        <EditableSection<string[]>
          id="skills"
          label="Skills Required"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={job.skills_required}
          isSaving={savingId === 'skills'}
          error={sectionError('skills')}
          onSave={(skills_required) =>
            runSave('skills', { skills_required }, 'Skills')
          }
          renderDisplay={(value) => (
            <div className="flex flex-wrap gap-2">
              {value.length ? (
                value.map((skill) => (
                  <span
                    key={skill}
                    className="bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full text-label-md">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-body-md text-on-surface-variant">
                  No skills added
                </span>
              )}
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <SkillsInput value={draft} onChange={setDraft} />
          )}
        />

        <EditableSection<CompensationDraft>
          id="compensation"
          label="Compensation"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            salaryMin: job.salary_min ?? '',
            salaryMax: job.salary_max ?? '',
            currency: job.currency,
          }}
          isSaving={savingId === 'compensation'}
          error={sectionError('compensation')}
          onSave={(draft) => {
            if (
              draft.salaryMin &&
              draft.salaryMax &&
              Number(draft.salaryMin) > Number(draft.salaryMax)
            ) {
              setSaveError('Min salary must be less than or equal to max.');
              return;
            }
            return runSave(
              'compensation',
              {
                salary_min: draft.salaryMin
                  ? Number(draft.salaryMin)
                  : undefined,
                salary_max: draft.salaryMax
                  ? Number(draft.salaryMax)
                  : undefined,
                currency: draft.currency,
              },
              'Compensation'
            );
          }}
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface">
              {value.salaryMin || value.salaryMax
                ? `${value.currency} ${value.salaryMin || '—'} - ${value.salaryMax || '—'}`
                : 'Not specified'}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                type="number"
                step="0.01"
                placeholder="Min salary"
                value={draft.salaryMin}
                onChange={(e) =>
                  setDraft({ ...draft, salaryMin: e.target.value })
                }
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Max salary"
                value={draft.salaryMax}
                onChange={(e) =>
                  setDraft({ ...draft, salaryMax: e.target.value })
                }
              />
              <DropDown
                options={CURRENCY_OPTIONS}
                value={draft.currency}
                onChange={(e) =>
                  setDraft({ ...draft, currency: e.target.value })
                }
              />
            </div>
          )}
        />

        <EditableSection<{ key: string; value: string }[]>
          id="requirements"
          label="Requirements"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={requirements}
          isSaving={savingId === 'requirements'}
          error={sectionError('requirements')}
          onSave={(entries) =>
            runSave('requirements', { requirements: entries }, 'Requirements')
          }
          renderDisplay={(value) => (
            <div className="space-y-1.5">
              {value.length ? (
                value.map((entry, i) => (
                  <p key={i} className="text-body-md text-on-surface-variant">
                    <span className="font-semibold text-on-surface">
                      {entry.key}:
                    </span>{' '}
                    {entry.value}
                  </p>
                ))
              ) : (
                <span className="text-body-md text-on-surface-variant">
                  No requirements added
                </span>
              )}
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <KeyValueListInput value={draft} onChange={setDraft} />
          )}
        />

        <EditableSection<{ key: string; value: string }[]>
          id="benefits"
          label="Benefits"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={benefits}
          isSaving={savingId === 'benefits'}
          error={sectionError('benefits')}
          onSave={(entries) =>
            runSave('benefits', { benefits: entries }, 'Benefits')
          }
          renderDisplay={(value) => (
            <div className="space-y-1.5">
              {value.length ? (
                value.map((entry, i) => (
                  <p key={i} className="text-body-md text-on-surface-variant">
                    <span className="font-semibold text-on-surface">
                      {entry.key}:
                    </span>{' '}
                    {entry.value}
                  </p>
                ))
              ) : (
                <span className="text-body-md text-on-surface-variant">
                  No benefits added
                </span>
              )}
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <KeyValueListInput value={draft} onChange={setDraft} />
          )}
        />
      </Card>

      {/* Location */}
      <Card>
        <EditableSection<LocationDraft>
          id="location"
          label="Location"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            lat: job.location?.point?.lat ?? null,
            lng: job.location?.point?.lng ?? null,
            address: job.location?.address ?? '',
            city: job.location?.city ?? '',
            state: job.location?.state ?? '',
            country: job.location?.country ?? '',
            postal_code: job.location?.postal_code ?? '',
          }}
          isSaving={savingId === 'location'}
          error={sectionError('location')}
          onSave={(draft) =>
            runSave(
              'location',
              {
                location: {
                  lat: draft.lat,
                  lng: draft.lng,
                  address: draft.address,
                  city: draft.city,
                  state: draft.state,
                  country: draft.country,
                  postal_code: draft.postal_code,
                },
              },
              'Location'
            )
          }
          renderDisplay={(value) => (
            <div className="space-y-3">
              {value.lat != null && value.lng != null && (
                <MapComponent
                  latitude={value.lat}
                  longitude={value.lng}
                  height={180}
                  showExpandButton
                  enableRouting={false}
                  interactive={false}
                />
              )}
              <p className="text-body-md text-on-surface-variant">
                {[value.address, value.city, value.state, value.country]
                  .filter(Boolean)
                  .join(', ') || 'Remote / not specified'}
              </p>
            </div>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="space-y-4">
              <MapComponent
                latitude={draft.lat}
                longitude={draft.lng}
                onSelect={(lat, lng) =>
                  setDraft({
                    ...draft,
                    lat: Number(lat.toFixed(6)),
                    lng: Number(lng.toFixed(6)),
                  })
                }
                height={220}
                showExpandButton
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Address"
                  value={draft.address}
                  onChange={(e) =>
                    setDraft({ ...draft, address: e.target.value })
                  }
                />
                <Input
                  placeholder="City"
                  value={draft.city}
                  onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                />
                <Input
                  placeholder="State / Province"
                  value={draft.state}
                  onChange={(e) =>
                    setDraft({ ...draft, state: e.target.value })
                  }
                />
                <Input
                  placeholder="Country"
                  value={draft.country}
                  onChange={(e) =>
                    setDraft({ ...draft, country: e.target.value })
                  }
                />
                <Input
                  placeholder="Postal Code"
                  value={draft.postal_code}
                  onChange={(e) =>
                    setDraft({ ...draft, postal_code: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        />
      </Card>

      {/* Contact */}
      <Card>
        <EditableSection<ContactDraft>
          id="contact"
          label="Contact Info"
          activeId={activeSection}
          onActivate={setActiveSection}
          onDeactivate={() => setActiveSection(null)}
          value={{
            email: job.contact_email ?? '',
            phone: job.contact_phone ?? '',
          }}
          isSaving={savingId === 'contact'}
          error={sectionError('contact')}
          onSave={(draft) =>
            runSave(
              'contact',
              { contact_email: draft.email, contact_phone: draft.phone },
              'Contact info'
            )
          }
          renderDisplay={(value) => (
            <p className="text-body-md text-on-surface-variant">
              {[value.email, value.phone].filter(Boolean).join(' · ') ||
                'Not specified'}
            </p>
          )}
          renderEditor={({ draft, setDraft }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(e) =>
                    setDraft({ ...draft, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft({ ...draft, phone: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        />
      </Card>

      {/* Danger zone */}
      <div className="border border-error/30 bg-error/5 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsDangerZoneOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer">
          <h3 className="text-title-md font-bold text-on-surface">
            Delete this job
          </h3>
          <ChevronDown
            size={20}
            className={`text-error shrink-0 transition-transform duration-300 ${
              isDangerZoneOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isDangerZoneOpen
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}>
          <div className="overflow-hidden">
            <div className="px-5 md:px-6 pb-5 md:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-body-md text-on-surface-variant">
                Once deleted, this job posting will be removed from listings and
                candidates will no longer be able to apply. This action cannot
                be undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 border border-error text-error rounded-lg font-medium hover:bg-error/10 transition-all cursor-pointer">
                <Trash2 size={16} />
                Delete Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete this job posting?"
          description={`"${job.title}" will be permanently removed and candidates will no longer be able to view or apply to it. This action cannot be undone.`}
          confirmLabel="Delete Job"
          isConfirming={isDeleting}
          onConfirm={() => void handleDeleteConfirmed()}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
