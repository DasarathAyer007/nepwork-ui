import { useState } from 'react';

import ConfirmDialog from '@/features/dashboard/components/ConfirmDialog';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import {
  Briefcase,
  Building2,
  Clock,
  FileText,
  MapPin,
  Upload,
  X,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { handleApiErrors } from '@/utils/handleApiErrors';

import { useApplyJobMutation } from '../jobApi';
import CoverLetterEditor from './CoverLetterEditor';
import ResumePdfPreview from './ResumePdfPreview';

const RESUME_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const COVER_LETTER_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'a',
];
const COVER_LETTER_ALLOWED_ATTR = ['href', 'rel', 'target'];

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const sanitizeCoverLetter = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: COVER_LETTER_ALLOWED_TAGS,
    ALLOWED_ATTR: COVER_LETTER_ALLOWED_ATTR,
  });

const optionalNumericString = (max: number, label: string) =>
  z
    .string()
    .optional()
    .refine((value) => !value || /^\d+(\.\d+)?$/.test(value), {
      message: `Enter a valid ${label}`,
    })
    .refine((value) => !value || Number(value) <= max, {
      message: `${label} is too large`,
    });

const applicationSchema = z.object({
  resume: z
    .instanceof(File, { message: 'Please upload your resume.' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Resume must be a PDF file.',
    })
    .refine((file) => file.size <= RESUME_MAX_SIZE, {
      message: 'Resume must be under 10MB.',
    }),
  years_of_experience: optionalNumericString(60, 'years of experience'),
  expected_salary: optionalNumericString(100_000_000, 'expected salary'),
  cover_letter: z
    .string()
    .min(1, 'Cover letter is required.')
    .superRefine((value, ctx) => {
      if (stripHtml(value).length < 50) {
        ctx.addIssue({
          code: 'custom',
          message: 'Cover letter must be at least 50 characters long.',
        });
      }
    }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  postedAt: string;
  thumbnail?: string | null;

  employerName?: string;
  employerEmail?: string;
  employerUsername?: string;
  onCancel?: () => void;
}

function JobApplicationForm({
  jobId,
  jobTitle,
  company,
  location,
  salary,
  jobType,
  postedAt,
  thumbnail,
  employerName,
  employerEmail,
  employerUsername,
}: JobApplicationFormProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [applyJob, { isLoading }] = useApplyJobMutation();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      years_of_experience: undefined,
      expected_salary: undefined,
      cover_letter: '',
    },
  });

  const submitApplication = async (data: ApplicationFormValues) => {
    try {
      const formData = new FormData();
      formData.append('job', jobId);
      formData.append('resume', data.resume);
      formData.append('cover_letter', sanitizeCoverLetter(data.cover_letter));
      if (data.years_of_experience) {
        formData.append('years_of_experience', data.years_of_experience);
      }
      if (data.expected_salary) {
        formData.append('expected_salary', data.expected_salary);
      }

      await applyJob(formData).unwrap();

      toast.success('Application submitted successfully!');
      setShowConfirm(false);

      navigate(`/dashboard/my-applications/`);
    } catch (error) {
      handleApiErrors(error, setError, toast);
      setShowConfirm(false);
    }
  };

  const onValid = () => setShowConfirm(true);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <form onSubmit={handleSubmit(onValid)} noValidate>
        {/* Top Section - Job Info Header */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 relative">
          <div className="absolute top-6 right-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-label-md font-medium">
            Applied via NepWork
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={`${company} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="text-on-surface-variant" size={28} />
                )}
              </div>

              <div>
                <h1 className="text-headline-lg font-bold text-on-surface mb-2">
                  {jobTitle}
                </h1>
                <div className="flex items-center gap-2 text-body-md text-primary font-medium">
                  {company}
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span className="text-on-surface-variant font-normal flex items-center gap-1">
                    <MapPin size={16} /> {location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-6 mt-4 text-body-md text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} /> {jobType}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-on-surface">
                      {salary}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    Posted{' '}
                    {new Date(postedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Employer Info */}
            <div className="bg-surface-container rounded-lg p-4 w-full md:w-64 border border-outline-variant/30">
              <p className="text-label-md font-medium text-on-surface-variant mb-2">
                EMPLOYER INFO
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  {(employerName || company || 'E')
                    .split(' ')
                    .map((name) => name[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-body-md font-bold text-on-surface">
                    {employerName || company || 'Unknown Employer'}
                  </p>

                  <p className="text-label-md text-on-surface-variant">
                    {employerEmail || 'Employer'}
                  </p>
                </div>
              </div>

              {employerUsername && (
                <Link
                  to={`/profile/${employerUsername}`}
                  className="block mt-3 text-body-md text-primary hover:underline">
                  View Employer Profile ↗
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Application Documents */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 mt-6">
          <h2 className="text-headline-md font-bold text-on-surface mb-2 flex items-center gap-2">
            <FileText className="text-primary" size={24} /> Application
            Documents
          </h2>

          <p className="text-body-md text-on-surface-variant mb-6">
            Please upload your resume as a PDF file.
          </p>

          <Controller
            control={control}
            name="resume"
            render={({ field: { onChange, value } }) => (
              <div className="space-y-4">
                {!value ? (
                  <label
                    className="
                      border-2 border-dashed border-outline-variant rounded-lg p-8
                      flex flex-col items-center justify-center
                      text-center hover:border-primary/50 transition-colors
                      cursor-pointer group
                    ">
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                        e.target.value = '';
                      }}
                    />

                    <Upload
                      className="text-on-surface-variant group-hover:text-primary transition-colors mb-2"
                      size={32}
                    />

                    <p className="text-body-md font-medium text-on-surface">
                      Resume / CV
                    </p>

                    <p className="text-label-md text-on-surface-variant">
                      PDF only, up to 10MB
                    </p>
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-surface-container rounded-lg px-4 py-3 border border-outline-variant/30">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="text-primary shrink-0" size={20} />
                        <span className="text-body-md text-on-surface truncate">
                          {value.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onChange(undefined)}
                        className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-error transition-colors cursor-pointer">
                        <X size={18} />
                      </button>
                    </div>
                    <ResumePdfPreview file={value} />
                  </div>
                )}
                {errors.resume && (
                  <p className="text-error text-label-md">
                    {errors.resume.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Experience & Availability */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 mt-6">
          <h2 className="text-headline-md font-bold text-on-surface mb-6 flex items-center gap-2">
            <Briefcase className="text-primary" size={24} /> Experience &
            Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-body-md font-medium text-on-surface mb-2">
                Years of Relevant Experience
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  placeholder="e.g. 5"
                  min={0}
                  className={`w-full bg-surface-container-lowest border rounded-md px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 outline-none ${
                    errors.years_of_experience
                      ? 'border-error'
                      : 'border-outline-variant focus:border-primary'
                  }`}
                  {...register('years_of_experience')}
                />
                <span className="absolute right-4 text-on-surface-variant text-body-md">
                  Years
                </span>
              </div>
              {errors.years_of_experience && (
                <p className="text-error text-label-md mt-1">
                  {errors.years_of_experience.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-body-md font-medium text-on-surface mb-2">
                Expected Salary
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  min={0}
                  className={`w-full bg-surface-container-lowest border rounded-md px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 outline-none ${
                    errors.expected_salary
                      ? 'border-error'
                      : 'border-outline-variant focus:border-primary'
                  }`}
                  {...register('expected_salary')}
                />
                <span className="absolute right-4 text-on-surface-variant text-body-md">
                  NPR
                </span>
              </div>
              {errors.expected_salary && (
                <p className="text-error text-label-md mt-1">
                  {errors.expected_salary.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 mt-6">
          <h2 className="text-headline-md font-bold text-on-surface mb-2 flex items-center gap-2">
            <FileText className="text-primary" size={24} /> Cover Letter
          </h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Why are you a good fit for this role?
          </p>

          <Controller
            control={control}
            name="cover_letter"
            render={({ field: { onChange, value, onBlur } }) => (
              <CoverLetterEditor
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                hasError={Boolean(errors.cover_letter)}
                placeholder="Highlight your skills, relevant projects, or service philosophy..."
              />
            )}
          />

          <div className="flex items-center justify-between mt-2">
            {errors.cover_letter ? (
              <p className="text-error text-label-md">
                {errors.cover_letter.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-label-md text-on-surface-variant">
              Min 50 characters recommended
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-medium hover:brightness-110 transition-all duration-200 active:scale-95 text-body-md disabled:opacity-50">
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>

      {showConfirm && (
        <ConfirmDialog
          variant="primary"
          title="Submit this application?"
          description={`You're about to apply for "${jobTitle}" at ${company}. Once submitted, you won't be able to edit your application.`}
          confirmLabel="Submit Application"
          cancelLabel="Review Again"
          isConfirming={isLoading}
          onConfirm={handleSubmit(submitApplication)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default JobApplicationForm;
