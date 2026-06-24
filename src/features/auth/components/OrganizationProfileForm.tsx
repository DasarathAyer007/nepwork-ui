import { type ChangeEvent, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Upload } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  DropDown,
  Input,
  Label,
  SubmitButton,
  TextArea,
} from '@/components/ui/forms';

import { handleApiErrors } from '../../../utils/handleApiErrors';
import { useCompleteOnboardingMutation } from '../services/authApi';
import { ProfileImageForm } from './ProfileImageForm';
import SocialLinksEditor from './SocialLinksEditor';
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
      organization_name: data.organizationName.trim(),
      industry: data.industry.trim(),
      employees_count: data.employeesCount,
      description: data.description?.trim() || undefined,
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

    if (data.profilePic) {
      multipartData.append('profile_picture', data.profilePic);
    }

    if (data.coverPic) {
      multipartData.append('cover_picture', data.coverPic);
    }

    if (data.logo) {
      multipartData.append('organization_logo', data.logo);
    }

    return {
      payload,
      multipartData,
    };
  };

  const submitPreparedData = async (submission: {
    payload: Record<string, unknown>;
    multipartData: FormData;
  }) => {
    await completeOnboarding(submission.multipartData).unwrap();
  };

  const onSubmit = async (data: OrganizationFormData) => {
    clearErrors('root');

    try {
      const submission = buildSubmissionData(data);
      await submitPreparedData(submission);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-2">
          <Label>Profile & Cover Photos</Label>

          <ProfileImageForm<OrganizationFormData>
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            variant="profile"
            type="email"
            value="john.doe@example.com"
            disabled
            className="cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            variant="profile"
            type="text"
            value="john_doe"
            disabled
            className="cursor-not-allowed"
          />
        </div>
        {/* Organization Name */}
        <div className="space-y-2">
          <Label>Organization Name</Label>
          <Input
            {...register('organizationName')}
            placeholder="Acme Corp"
            variant="profile"
          />
          {errors.organizationName && (
            <p className="text-error text-xs mt-1">
              {errors.organizationName.message}
            </p>
          )}
        </div>

        {/* Industry & Employees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <p className="text-error text-xs mt-1">
                {errors.industry.message}
              </p>
            )}
          </div>
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
              <p className="text-error text-xs mt-1">
                {errors.employeesCount.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <TextArea
            {...register('description')}
            rows={4}
            placeholder="Describe your organization's mission..."
          />
        </div>

        {/* Founded Year & Tax ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label>Founded Year</Label>
            <Input
              variant="profile"
              {...register('foundedYear')}
              type="number"
              min={1900}
              max={2024}
              placeholder="e.g. 2015"
            />
            {errors.foundedYear && (
              <p className="text-error text-xs mt-1">
                {errors.foundedYear.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tax ID / Registration Number</Label>
            <Input
              variant="profile"
              {...register('taxId')}
              placeholder="TX-99201-XX"
            />
          </div>
        </div>

        {/* Office Address */}
        <div className="space-y-2">
          <Label>Office Address</Label>
          <Input
            variant="profile"
            {...register('address')}
            placeholder="123 Business Way, Suite 100"
          />
        </div>

        {/* Company Logo */}
        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div
            className="border-2 border-dashed border-outline-variant rounded-md p-8 flex flex-col items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group"
            onClick={() => document.getElementById('logo-upload')?.click()}>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-h-32 mb-2"
              />
            ) : (
              <>
                <Upload className="w-10 h-10 text-outline mb-2 group-hover:text-primary" />
                <p className="text-sm text-on-surface-variant">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-outline">
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
            <p className="text-error text-xs">{errors.logo.message}</p>
          )}
        </div>

        {/* Social Links */}
        <div className="border-t border-outline-variant pt-8">
          <Label>Social Profiles</Label>
          <SocialLinksEditor name="socialLinks" />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <SubmitButton
            disabled={isSubmitting}
            loading={isSubmitting}
            variant="primary"
            className="flex items-center gap-2">
            {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
            <ArrowRight className="w-5 h-5" />
          </SubmitButton>
        </div>
        {errors.root?.serverError?.message && (
          <p className="text-error text-xs text-right">
            {errors.root.serverError.message}
          </p>
        )}
      </form>
    </FormProvider>
  );
}
