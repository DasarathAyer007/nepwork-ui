import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Plus, X } from 'lucide-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import {
  DropDown,
  Input,
  Label,
  SubmitButton,
  TextArea,
} from '@/components/ui/forms';

import { useDebounce } from '../../../hooks/useDebounce';
import { handleApiErrors } from '../../../utils/handleApiErrors';
import {
  useCompleteOnboardingMutation,
  useGetSkillsQuery,
} from '../services/authApi';
import type { LoginUser } from '../types';
import { ProfileImageForm } from './ProfileImageForm';
import SocialLinksEditor from './SocialLinksEditor';
import { type IndividualFormData, individualSchema } from './schemas';

export default function IndividualProfileForm() {
  const [completeOnboarding] = useCompleteOnboardingMutation();

  const methods = useForm<IndividualFormData>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      skills: [],
      socialLinks: [],
      profilePic: undefined,
      coverPic: undefined,
    },
  });
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = methods;
  const skills = useWatch({ control, name: 'skills', defaultValue: [] });
  const [skillInputOpen, setSkillInputOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setValue('skills', [...skills, trimmed], { shouldValidate: true });
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setValue(
      'skills',
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const debouncedSearch = useDebounce(skillInput, 100);

  const { data: recommendedSkills = [] } = useGetSkillsQuery(
    { search: debouncedSearch },
    { skip: !debouncedSearch.trim() }
  );

  const filteredRecommendations = recommendedSkills.filter(
    (skill) => !skills.includes(skill.name)
  );

  const buildSubmissionData = (data: IndividualFormData) => {
    const formData = new FormData();

    formData.append('account_type', 'personal');
    formData.append('date_of_birth', data.dateOfBirth);
    formData.append('gender', data.gender || '');
    formData.append('bio', data.bio?.trim() || '');
    formData.append('profile_visibility', data.profileVisibility ?? 'public');

    data.skills.forEach((skill) => {
      formData.append('skills', skill.trim());
    });

    data.socialLinks?.forEach((item, index) => {
      formData.append(`social_links[${index}][platform]`, item.platform || '');
      formData.append(`social_links[${index}][url]`, item.url || '');
    });

    if (data.profilePic) {
      formData.append('profile_picture', data.profilePic);
    }

    if (data.coverPic) {
      formData.append('cover_picture', data.coverPic);
    }

    return formData;
  };

  const onSubmit = async (data: IndividualFormData) => {
    clearErrors('root');

    try {
      const submission = buildSubmissionData(data);
      await completeOnboarding(submission).unwrap();
      toast.success('Individual onboarding completed successfully.');
    } catch (error) {
      handleApiErrors(error, setError, toast);
      setError('root.serverError', {
        type: 'server',
        message: 'Failed to submit individual onboarding details.',
      });
    }
  };

  const user = useSelector(
    (state: { auth: { user: LoginUser } }) => state.auth.user
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-2">
          <Label>Profile & Cover Photos</Label>

          <ProfileImageForm<IndividualFormData>
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className="space-y-2">
          <Label className="form-label">Full Name</Label>
          <Input
            variant="profile"
            type="text"
            value={user?.full_name || ''}
            disabled
            className="cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <Label className="form-label">Email</Label>
          <Input
            variant="profile"
            type="email"
            value={user?.email || ''}
            disabled
            className="cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <Label className="form-label">Username</Label>
          <Input
            variant="profile"
            type="text"
            value={user?.username || ''}
            disabled
            className="cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label className="form-label">Date of Birth</Label>
            <Input {...register('dateOfBirth')} type="date" variant="profile" />
            {errors.dateOfBirth && (
              <p className="text-error text-xs mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="form-label">Gender</Label>
            <DropDown
              {...register('gender')}
              className="form-input"
              options={[
                { label: 'Select Gender', value: '' },
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
            />
            {errors.gender && (
              <p className="text-error text-xs mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label>Bio</Label>
          <TextArea
            {...register('bio')}
            rows={4}
            placeholder="Tell us about your professional background..."
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label>Skills (Select multiple)</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setSkillInputOpen(!skillInputOpen)}
              className="border border-dashed border-outline text-primary text-xs px-3 py-1 rounded-full hover:bg-surface-container-high transition-colors">
              <Plus className="w-3 h-3 inline mr-1" /> Add Skill
            </button>
          </div>
          {errors.skills && (
            <p className="text-error text-xs">{errors.skills.message}</p>
          )}

          {skillInputOpen && (
            <div className="mt-2 relative">
              <div className="flex gap-2">
                <Input
                  variant="profile"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Type a skill..."
                  className="flex-1 bg-surface-container border-outline-variant rounded-md p-2 input-focus border text-sm"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="bg-primary text-on-primary px-3 py-2 rounded-md text-sm hover:shadow transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {skillInput && filteredRecommendations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filteredRecommendations.slice(0, 10).map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => addSkill(rec.name)}
                      className="bg-surface-container-high text-on-surface-variant text-xs px-3 py-1 rounded-full border border-outline-variant hover:bg-primary-container hover:text-on-primary-container transition">
                      {rec.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Visibility */}
        <div className="space-y-2">
          <Label>Profile Visibility</Label>
          <DropDown
            {...register('profileVisibility')}
            options={[
              { label: 'Public', value: 'public' },
              { label: 'Private', value: 'private' },
              { label: 'Limited', value: 'connections' },
            ]}
            className="pxbg-surface-container border-outline-variant rounded-md p-2 input-focus border text-on-surface"
          />
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
            className="bg-primary text-on-primary px-10 py-3 rounded-md font-bold hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-2">
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
