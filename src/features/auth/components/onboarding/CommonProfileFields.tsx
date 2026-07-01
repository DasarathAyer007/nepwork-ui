import type {
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Input, Label, TextArea } from '@/components/ui/forms';

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
    <>
      {/* ── Profile & Cover Photos ─────────────────────────────────────────── */}
      <div className="space-y-2">
        <Label>Profile &amp; Cover Photos</Label>
        <ProfileImageForm<T> setValue={setValue} watch={watch} />
      </div>

      {/* ── Read-only account info ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <Label>Full Name</Label>
        <Input
          variant="profile"
          type="text"
          value={user?.full_name ?? ''}
          disabled
          className="cursor-not-allowed"
        />
      </div>
      <div className="space-y-1">
        <Label>Email</Label>
        <Input
          variant="profile"
          type="email"
          value={user?.email ?? ''}
          disabled
          className="cursor-not-allowed"
        />
      </div>
      <div className="space-y-1">
        <Label>Username</Label>
        <Input
          variant="profile"
          type="text"
          value={user?.username ?? ''}
          disabled
          className="cursor-not-allowed"
        />
      </div>

      {/* ── Bio ───────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <Label>Bio</Label>
        <TextArea {...register('bio')} rows={4} placeholder={bioPlaceholder} />
      </div>

      {/* ── Social Profiles ───────────────────────────────────────────────── */}
      <div className="border-t border-outline-variant pt-6 space-y-3">
        <Label>Social Profiles</Label>
        <SocialLinksEditor name="socialLinks" />
      </div>
    </>
  );
}
