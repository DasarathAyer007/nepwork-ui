import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Plus, X } from 'lucide-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import {
  DropDown,
  FormSection,
  Input,
  Label,
  SubmitButton,
} from '@/components/ui/forms';

import { useDebounce } from '../../../../hooks/useDebounce';
import { handleApiErrors } from '../../../../utils/handleApiErrors';
import {
  useCompleteOnboardingMutation,
  useGetSkillsQuery,
} from '../../api/authApi';
import { CommonProfileFields } from './CommonProfileFields';
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
    formData.append('date_of_birth', data.dateOfBirth || '');
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Shared fields (photos, account info, bio, social links) */}
        <CommonProfileFields<IndividualFormData>
          setValue={setValue}
          watch={watch}
          bioPlaceholder="Tell us about your professional background..."
        />

        {/* Section 4: Personal Details */}
        <FormSection
          title="Personal Details"
          description="Information regarding date of birth and gender.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input {...register('dateOfBirth')} type="date" />
              {errors.dateOfBirth && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <DropDown
                {...register('gender')}
                options={[
                  { label: 'Select Gender', value: '' },
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Non-binary', value: 'non-binary' },
                  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
                ]}
              />
              {errors.gender && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Section 5: Professional Skills */}
        <FormSection
          title="Skills &amp; Expertise"
          description="Add key professional skills and adjust your profile visibility.">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Skills (Select multiple)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-error transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSkillInputOpen(!skillInputOpen)}
                  className="border border-dashed border-outline-variant text-primary text-xs px-3 py-1.5 rounded-full hover:bg-primary/5 transition-all flex items-center gap-1 font-semibold cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>
              {errors.skills && (
                <p className="text-xs text-error font-medium">
                  {errors.skills.message}
                </p>
              )}

              {skillInputOpen && (
                <div className="mt-3 relative">
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(skillInput);
                        }
                      }}
                      placeholder="Type a skill (e.g. React)..."
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(skillInput)}
                      className="bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 shadow transition active:scale-95 cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {skillInput && filteredRecommendations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-surface-container-low rounded-lg border border-outline-variant/30">
                      {filteredRecommendations.slice(0, 10).map((rec) => (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => addSkill(rec.name)}
                          className="bg-surface-container-lowest text-on-surface-variant text-xs px-3 py-1 rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary hover:border-primary transition cursor-pointer">
                          {rec.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-outline-variant/20 pt-4">
              <Label>Profile Visibility</Label>
              <DropDown
                {...register('profileVisibility')}
                options={[
                  { label: 'Public (Recommended)', value: 'public' },
                  { label: 'Private (Hidden)', value: 'private' },
                  { label: 'Limited (Connections Only)', value: 'connections' },
                ]}
              />
            </div>
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
