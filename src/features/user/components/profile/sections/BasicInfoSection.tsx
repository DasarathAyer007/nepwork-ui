import { useState } from 'react';

import EditableProfileSection from '../EditableProfileSection';

import { Input } from '@/components/ui/forms/Input';
import type { UserDetails } from '@/types/user.types';

import { useUpdateProfileMutation } from '../../../api/profileApi';

type Props = {
  profile: UserDetails;
  editable: boolean;
};

export default function BasicInfoSection({
  profile,
  editable,
}: Props) {
  const [activeId, setActiveId] =
    useState<string | null>(null);

  const [updateProfile, { isLoading }] =
    useUpdateProfileMutation();

  const saveField = async (
    values: Record<string, unknown>
  ) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null
        ) {
          formData.append(key, String(value));
        }
      });

      await updateProfile(formData).unwrap();

      setActiveId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      <div className="px-5 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <p className="mt-0.5 text-xs text-gray-500">
          Your public identity on NepWork.
        </p>
      </div>

      <div className="divide-y divide-gray-100 px-5">

        {/* FULL NAME */}

        <EditableProfileSection
          id="full-name"
          title="Full Name"
          editable={editable}
          activeId={activeId}
          onActivate={setActiveId}
          onDeactivate={() =>
            setActiveId(null)
          }
          value={profile.full_name}
          isSaving={isLoading}
          onSave={(draft) =>
            saveField({
              full_name: draft,
            })
          }
          renderDisplay={(value) => (
            <p className="text-gray-700">
              {value}
            </p>
          )}
          renderEditor={({
            draft,
            setDraft,
          }) => (
            <Input
              value={draft}
              placeholder="Full Name"
              onChange={(e) =>
                setDraft(e.target.value)
              }
            />
          )}
        />

        {/* USERNAME */}

        <section className="py-6">
        <h3 className="text-lg font-semibold">
            Username
        </h3>

        <p className="mt-3 text-gray-800 font-medium">
            @{profile.username}
        </p>

        <p className="mt-2 text-sm text-gray-500">
            Usernames are permanent and cannot be changed.
        </p>
        </section>

      </div>
    </div>
  );
}