import { useState } from 'react';

import {
  ServiceStepIndicator,
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
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { type FieldPath, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
        latitude: values.location.latitude,
        longitude: values.location.longitude,
        city: values.location.city,
        state: values.location.state,
        country: values.location.country,
        postal_code: values.location.postal_code,
      })
    );

    try {
      await createService(formData).unwrap();
      navigate('/services');
    } catch (err) {
      // TODO: surface a submit error to the user
      console.error('Failed to create service', err);
    }
  };

  return (
    <main className="grow pt-10 pb-xl px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto">
        <ServiceStepIndicator
          step={step}
          totalSteps={TOTAL_STEPS}
          label={STEP_LABELS[step - 1]}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-gutter">
            {step === 1 && <StepBasicInfo />}
            {step === 2 && <StepPricingSkills />}
            {step === 3 && <StepLocation />}
            {step === 4 && <StepReview />}

            <div className="mt-xl flex justify-between items-center gap-md">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="px-lg py-sm rounded-lg border border-primary text-primary font-label-md hover:bg-primary/10 transition-all flex items-center gap-xs active:scale-95 disabled:opacity-40 disabled:pointer-events-none">
                <ArrowLeft size={18} />
                Back
              </button>

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center gap-xs active:scale-95">
                  Next Step
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-xl py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center gap-sm active:scale-95 disabled:opacity-60 disabled:pointer-events-none">
                  {isLoading ? 'Posting…' : 'Post Service'}
                  <Rocket size={18} />
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
