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
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">


      <div className="px-6 py-5 border-b border-outline-variant">

        <h2 className="text-2xl font-semibold text-on-surface">
          Skills
        </h2>

        {editable && (
          <p className="mt-1 text-sm text-on-surface-variant">
            Add or remove your professional skills.
          </p>
        )}

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

              <div className="flex flex-wrap gap-3">

                {skills.map(
                  (skill) => (

                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            ) : (

             <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center">
                <p className="text-sm text-on-surface-variant">
                  No skills have been added yet.
                </p>
              </div>

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