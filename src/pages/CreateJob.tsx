import { useState } from 'react';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import {
  StepJobBasicInfo,
  StepJobDetails,
  StepJobLocationStatus,
  StepJobReview,
  StepJobSkillsCompensation,
} from '@/features/jobs';
import { useCreateJobMutation } from '@/features/jobs/jobApi';
import {
  type JobFormValues,
  defaultJobFormValues,
  jobFormSchema,
  jobStepFields,
} from '@/features/jobs/jobSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rocket } from 'lucide-react';
import { type FieldPath, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import StepIndicator from '@/components/ui/StepIndicator';
import { WizardActions } from '@/components/ui/forms';

const STEP_LABELS = [
  'Tell us about the role',
  'Job details',
  'Skills & compensation',
  'Location & status',
  'Review & post',
];

const TOTAL_STEPS = 5;

export default function CreateJob() {
  const [step, setStep] = useState(1);
  const [createJob, { isLoading }] = useCreateJobMutation();

  const methods = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: defaultJobFormValues,
    mode: 'onChange',
  });
  const navigate = useNavigate();

  const { trigger, handleSubmit } = methods;

  async function goNext() {
    const fields = jobStepFields[step] as Array<FieldPath<JobFormValues>>;
    const valid =
      fields.length === 0
        ? true
        : await trigger(fields as FieldPath<JobFormValues>[]);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const onSubmit = async (values: JobFormValues) => {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    if (values.thumbnail) {
      formData.append('thumbnail', values.thumbnail);
    }
    formData.append('job_type', values.job_type);
    formData.append('work_mode', values.work_mode);
    formData.append('experience_level', values.experience_level);
    formData.append(
      'experience_years',
      values.experience_years ? String(values.experience_years) : ''
    );
    formData.append('skills_required', JSON.stringify(values.skills_required));

    const requirements = Object.fromEntries(
      values.requirements?.map((item) => [item.key, item.value])
    );
    formData.append('requirements', JSON.stringify(requirements));
    formData.append(
      'salary_min',
      values.salary_min ? String(values.salary_min) : ''
    );
    formData.append(
      'salary_max',
      values.salary_max ? String(values.salary_max) : ''
    );
    formData.append('currency', values.currency);

    const benefits = Object.fromEntries(
      values.benefits?.map((item) => [item.key, item.value])
    );
    formData.append('benefits', JSON.stringify(benefits));
    formData.append('deadline', values.deadline || '');
    formData.append('contact_email', values.contact_email || '');
    formData.append('contact_phone', values.contact_phone || '');
    formData.append('status', values.status);

    if (values.location.lat != null && values.location.lng != null) {
      const locationPayload = {
        lat: values.location.lat,
        lng: values.location.lng,
        address: values.location.address,
        city: values.location.city,
        state: values.location.state,
        country: values.location.country,
        postal_code: values.location.postal_code,
      };
      formData.append('location', JSON.stringify(locationPayload));
    } else {
      const locationPayload = {
        lat: null,
        lng: null,
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
      };
      formData.append('location', JSON.stringify(locationPayload));
    }
    formData.append('currency', values.currency);
    try {
      await createJob(formData).unwrap();
      toast.success('Job posted successfully!');
      navigate('/jobs');
      // TODO: navigate to the new job's detail page / show a success toast
    } catch (err) {
      // TODO: surface a submit error to the user
      toast.error(getApiErrorMessage(err, "Couldn't post this job. Please try again."));
    }
  };

  const submitForm = handleSubmit((values) => {
    void onSubmit(values as JobFormValues);
  });

  return (
    <main className="grow pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-background/50">
      <div className="max-w-3xl mx-auto">
        <StepIndicator
          step={step}
          totalSteps={TOTAL_STEPS}
          label={STEP_LABELS[step - 1]}
          stepLabels={STEP_LABELS}
        />

        <FormProvider {...methods}>
          <form onSubmit={submitForm} className="space-y-6">
            <div className="transition-all duration-300 ">
              {step === 1 && <StepJobBasicInfo />}
              {step === 2 && <StepJobDetails />}
              {step === 3 && <StepJobSkillsCompensation />}
              {step === 4 && <StepJobLocationStatus />}
              {step === 5 && <StepJobReview />}
            </div>

            <WizardActions
              step={step}
              totalSteps={TOTAL_STEPS}
              onBack={goBack}
              onNext={() => void goNext()}
              onSubmit={() => void submitForm()}
              isSubmitting={isLoading}
              submitLabel="Post Job"
              submitLoadingLabel="Posting…"
              submitIcon={Rocket}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
