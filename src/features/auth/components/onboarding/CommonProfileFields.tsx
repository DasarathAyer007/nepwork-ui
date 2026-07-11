import type {
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { FormSection, Input, Label, TextArea } from '@/components/ui/forms';

import type { LoginUser } from '../../types';
import SocialLinksEditor from '../SocialLinksEditor';
import { ProfileImageForm } from './ProfileImageForm';

interface CommonProfileFieldsProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  bioPlaceholder?: string;
}

export function CommonProfileFields<T extends FieldValues>({
  setValue,
  watch,
  bioPlaceholder = 'Tell us about your professional background...',
}: CommonProfileFieldsProps<T>) {
  const { register } = useFormContext();

  const user = useSelector(
    (state: { auth: { user: LoginUser } }) => state.auth.user
  );

  return (
    <div className="space-y-6">
      {/* Section 1: Account Profile & Photos */}
      <FormSection
        title="Account Profile"
        description="Your avatar, cover photos, and core account details.">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Profile &amp; Cover Photos</Label>
            <ProfileImageForm<T> setValue={setValue} watch={watch} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                value={user?.full_name ?? ''}
                disabled
                className="cursor-not-allowed bg-surface-container-low"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={user?.email ?? ''}
                disabled
                className="cursor-not-allowed bg-surface-container-low"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                type="text"
                value={user?.username ?? ''}
                disabled
                className="cursor-not-allowed bg-surface-container-low"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Section 2: Bio */}
      <FormSection
        title="About You"
        description="Write a short summary about your background, experience, or skills.">
        <div className="space-y-2">
          <Label>Bio</Label>
          <TextArea
            {...register('bio')}
            rows={4}
            placeholder={bioPlaceholder}
            className="w-full"
          />
        </div>
      </FormSection>

      {/* Section 3: Social Profiles */}
      <FormSection
        title="Social Connections"
        description="Add your personal or professional social links.">
        <div className="space-y-2">
          <Label>Social Profiles</Label>
          <SocialLinksEditor name="socialLinks" />
        </div>
      </FormSection>
    </div>
  );
}
