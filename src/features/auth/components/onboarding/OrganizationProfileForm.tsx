import { type ChangeEvent, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Upload } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import {
  DropDown,
  FormSection,
  Input,
  Label,
  SubmitButton,
} from '@/components/ui/forms';

import { handleApiErrors } from '../../../../utils/handleApiErrors';
import { useCompleteOnboardingMutation } from '../../api/authApi';
import { CommonProfileFields } from './CommonProfileFields';
import { type OrganizationFormData, organizationSchema } from './schemas';

export default function OrganizationProfileForm() {
  const [completeOnboarding] = useCompleteOnboardingMutation();

  const methods = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      socialLinks: [],
      profilePic: undefined,
      coverPic: undefined,
      logo: undefined,
    },
  });
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('logo', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const buildSubmissionData = (data: OrganizationFormData) => {
    const cleanedSocialLinks =
      data.socialLinks
        ?.map((item) => ({
          platform: item.platform.trim().toLowerCase(),
          url: item.url?.trim() || '',
        }))
        .filter((item) => item.platform && item.url) ?? [];

    const payload = {
      account_type: 'organization' as const,
      industry: data.industry.trim(),
      employees_count: data.employeesCount,
      bio: data.bio?.trim() || undefined,
      founded_year:
        data.foundedYear === undefined || data.foundedYear === ''
          ? undefined
          : Number(data.foundedYear),
      tax_id: data.taxId?.trim() || undefined,
      address: data.address?.trim() || undefined,
      social_links: cleanedSocialLinks,
    };

    const multipartData = new FormData();
    multipartData.append('payload', JSON.stringify(payload));

    if (data.profilePic)
      multipartData.append('profile_picture', data.profilePic);
    if (data.coverPic) multipartData.append('cover_picture', data.coverPic);
    if (data.logo) multipartData.append('organization_logo', data.logo);

    return multipartData;
  };

  const onSubmit = async (data: OrganizationFormData) => {
    clearErrors('root');

    try {
      await completeOnboarding(buildSubmissionData(data)).unwrap();
      toast.success('Organization onboarding completed successfully.');
    } catch (error) {
      handleApiErrors(error, setError, toast);
      setError('root.serverError', {
        type: 'server',
        message: 'Failed to submit organization onboarding details.',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Shared fields (photos, account info, bio, social links) */}
        <CommonProfileFields<OrganizationFormData>
          setValue={setValue}
          watch={watch}
          bioPlaceholder="Describe your organization's mission and values..."
        />

        {/* Section 4: Company Info */}
        <FormSection
          title="Company Info"
          description="Key registration and details about your organization.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Founded Year</Label>
              <Input
                {...register('foundedYear')}
                type="number"
                min={1900}
                max={2026}
                placeholder="e.g. 2015"
              />
              {errors.foundedYear && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.foundedYear.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <DropDown
                options={[
                  { label: 'Select Industry', value: '' },
                  { label: 'Technology', value: 'tech' },
                  { label: 'Finance', value: 'finance' },
                  { label: 'Healthcare', value: 'healthcare' },
                  { label: 'Education', value: 'education' },
                ]}
                {...register('industry')}
              />
              {errors.industry && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.industry.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
            <div className="space-y-2">
              <Label>Employees Count</Label>
              <DropDown
                options={[
                  { label: 'Select Count', value: '' },
                  { label: '1-10 Employees', value: '1-10' },
                  { label: '11-50 Employees', value: '11-50' },
                  { label: '51-200 Employees', value: '51-200' },
                  { label: '201+ Employees', value: '201+' },
                ]}
                {...register('employeesCount')}
              />
              {errors.employeesCount && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.employeesCount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tax ID / Registration Number</Label>
              <Input {...register('taxId')} placeholder="TX-99201-XX" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-outline-variant/20">
            <Label>Office Address</Label>
            <Input
              {...register('address')}
              placeholder="123 Business Way, Suite 100"
            />
          </div>
        </FormSection>

        {/* Section 5: Company Identity Logo */}
        <FormSection
          title="Company Identity"
          description="Upload your corporate logo representing the organization.">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div
              className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container/35 hover:bg-surface-container transition-colors cursor-pointer group"
              onClick={() => document.getElementById('logo-upload')?.click()}>
              {logoPreview ? (
                <div className="relative group/logo-thumb max-h-28 overflow-hidden rounded-lg">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-28 rounded-lg shadow-sm border border-outline-variant/30"
                  />
                  <div className="absolute inset-0 bg-on-background/20 opacity-0 group-hover/logo-thumb:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <span className="text-white text-xs font-semibold">
                      Change Logo
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-outline mb-2 group-hover:text-primary transition-transform group-hover:scale-105" />
                  <p className="text-sm font-semibold text-on-surface">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    SVG, PNG, or JPG (max. 2MB)
                  </p>
                </>
              )}
              <input
                id="logo-upload"
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
            {errors.logo && (
              <p className="text-xs text-error font-medium">
                {errors.logo.message}
              </p>
            )}
          </div>
        </FormSection>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 items-center">
          {errors.root?.serverError?.message && (
            <p className="text-xs text-error font-medium">
              {errors.root.serverError.message}
            </p>
          )}
          <SubmitButton
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8">
            {isSubmitting ? 'Submitting…' : 'Complete Onboarding'}
            <ArrowRight className="w-4 h-4" />
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
