import { useState } from 'react';

import EditableSection from '../EditableProfileSection';

import { Input } from '@/components/ui/forms/Input';
import type { UserDetails } from '@/types/user.types';

import { useUpdateProfileMutation } from '../../../api/profileApi';

type Props = {
  profile: UserDetails;
  editable: boolean;
};

export default function SkillsSection({
  profile,
  editable,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const [updateProfile, { isLoading }] =
    useUpdateProfileMutation();


  const saveSkills = async (
    skills: string[]
  ) => {
    try {
      const formData = new FormData();

      skills.forEach((skill) => {
        formData.append(
          'skills',
          skill
        );
      });

      await updateProfile(
        formData
      ).unwrap();

      setActiveId(null);

    } catch (error) {
      console.error(
        'Failed to update skills',
        error
      );
    }
  };


  if (
    profile.account_type !== 'personal'
  ) {
    return null;
  }


  const currentSkills =
    profile.skills?.map(
      (skill) => skill.name
    ) ?? [];


  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">


      <div className="px-6 py-5 border-b border-gray-100">

        <h2 className="text-xl font-semibold text-gray-900">
          Skills
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Add skills that describe your expertise.
        </p>

      </div>


      <div className="px-6 py-4">


        <EditableSection
          id="skills"
          title="Skills"
          editable={editable}
          activeId={activeId}
          onActivate={setActiveId}
          onDeactivate={() =>
            setActiveId(null)
          }
          value={currentSkills}
          isSaving={isLoading}
          allowEnterToSave={false}


          onSave={async (draft) => {

            await saveSkills(
              draft
                .map((skill) =>
                  skill.trim()
                )
                .filter(Boolean)
            );

          }}


          renderDisplay={(skills) => (

            skills.length ? (

              <div className="flex flex-wrap gap-2">

                {skills.map(
                  (skill) => (

                    <span
                      key={skill}
                      className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full text-sm"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            ) : (

              <p className="text-gray-500">
                No skills added yet.
              </p>

            )

          )}


          renderEditor={({
            draft,
            setDraft,
          }) => (

            <Input
              value={
                draft.join(', ')
              }

              placeholder="React, Django, Python"

              onChange={(e) => {

                setDraft(
                  e.target.value
                    .split(',')
                    .map(
                      (skill) =>
                        skill.trim()
                    )
                );

              }}
            />

          )}

        />


      </div>

    </div>
  );
}