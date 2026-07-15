import { useState } from 'react';

import { getApiErrorMessage } from '@/features/dashboard/utils/getApiErrorMessage';
import {
  StepBasicInfo,
  StepLocation,
  StepPricingSkills,
  StepReview,
} from '@/features/services/';
import { useCreateServiceMutation } from '@/features/services/serviceApi';
import {
  type ServiceFormValues,
  defaultServiceFormValues,
  serviceFormSchema,
  stepFields,
} from '@/features/services/serviceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rocket } from 'lucide-react';
import { type FieldPath, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import StepIndicator from '@/components/ui/StepIndicator';
import { WizardActions } from '@/components/ui/forms';

const STEP_LABELS = [
  'Tell us about the task',
  'Set your price & skills',
  'Where you work',
  'Review & post',
];

const TOTAL_STEPS = 4;

export default function CreateService() {
  const [step, setStep] = useState(1);
  const [createService, { isLoading }] = useCreateServiceMutation();
  const navigate = useNavigate();

  const methods = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: defaultServiceFormValues,
    mode: 'onChange',
  });

  const { trigger, handleSubmit } = methods;

  async function goNext() {
    const fields = stepFields[step] as FieldPath<ServiceFormValues>[];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const onSubmit = async (values: ServiceFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    if (values.thumbnail) formData.append('thumbnail', values.thumbnail);
    formData.append('price_type', values.price_type);
    if (values.price != null) formData.append('price', String(values.price));
    formData.append('currency', values.currency);
    values.skills.forEach((skill) => formData.append('skills', skill));
    formData.append('radius_km', String(values.radius_km));
    formData.append('status', values.status);
    if (values.available_from)
      formData.append('available_from', values.available_from);
    if (values.available_to)
      formData.append('available_to', values.available_to);
    formData.append(
      'location',
      JSON.stringify({
        lat: values.location.latitude,
        lng: values.location.longitude,
        city: values.location.city,
        state: values.location.state,
        country: values.location.country,
        postal_code: values.location.postal_code,
      })
    );

    try {
      await createService(formData).unwrap();
      toast.success('Service posted successfully!');
      navigate('/services');
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Couldn't post this service. Please try again.")
      );
    }
  };

  // Single wrapped submit handler — referenced by both the form's native
  // onSubmit and the WizardActions submit button, so react-hook-form's
  // validation + our onSubmit logic only ever run once per click.
  const submitForm = handleSubmit((values) => {
    void onSubmit(values);
  });

  return (
    <main className="flex-grow pt-28 pb-16 px-margin-mobile md:px-margin-desktop bg-background/50">
      <div className="max-w-3xl mx-auto">
        <StepIndicator
          step={step}
          totalSteps={TOTAL_STEPS}
          label={STEP_LABELS[step - 1]}
          stepLabels={STEP_LABELS}
        />

        <FormProvider {...methods}>
          <form onSubmit={submitForm} className="space-y-6">
            <div className="transition-all duration-300">
              {step === 1 && <StepBasicInfo />}
              {step === 2 && <StepPricingSkills />}
              {step === 3 && <StepLocation />}
              {step === 4 && <StepReview />}
            </div>

            <WizardActions
              step={step}
              totalSteps={TOTAL_STEPS}
              onBack={goBack}
              onNext={() => void goNext()}
              onSubmit={() => void submitForm()}
              isSubmitting={isLoading}
              submitLabel="Post Service"
              submitLoadingLabel="Posting…"
              submitIcon={Rocket}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}