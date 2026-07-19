import { useState } from 'react';

import EditableProfileSection from '../EditableProfileSection';

import { Input } from '@/components/ui/forms/Input';
import { TextArea } from '@/components/ui/forms/TextArea';

import type { UserDetails } from '@/types/user.types';

import { useUpdateProfileMutation } from '../../../api/profileApi';

type Props = {
  profile: UserDetails;
  editable: boolean;
};

export default function AboutSection({
  profile,
  editable,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const [updateProfile, { isLoading }] =
  useUpdateProfileMutation();

    const saveField = async (
    values: Record<string, unknown>
    ) => {
    try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          About
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Basic information about yourself.
        </p>
      </div>

      <div className="divide-y divide-gray-100 px-6 py-2">

        {/* BIO */}

        <EditableProfileSection
          id="bio"
          title="Bio"
          editable={editable}
          activeId={activeId}
          onActivate={setActiveId}
          onDeactivate={() =>
            setActiveId(null)
          }
          value={profile.bio ?? ''}
          isSaving={isLoading}
          allowEnterToSave={false}
          onSave={(draft) =>
            saveField({
                bio: draft,
            })
            }
          renderDisplay={(value) => (
            <p className="text-gray-700 whitespace-pre-wrap leading-7">
              {value ||
                'Tell people about yourself.'}
            </p>
          )}
          renderEditor={({
            draft,
            setDraft,
          }) => (
            <TextArea
              rows={5}
              value={draft}
              onChange={(e) =>
                setDraft(
                  e.target.value
                )
              }
            />
          )}
        />

        {/* PHONE */}

        <EditableProfileSection
          id="phone"
          title="Phone Number"
          editable={editable}
          activeId={activeId}
          onActivate={setActiveId}
          onDeactivate={() =>
            setActiveId(null)
          }
          value={
            profile.phone_number ?? ''
          }
          isSaving={isLoading}
          onSave={(draft) => 
            saveField({
              phone_number: draft,
            })
          }
          renderDisplay={(value) => (
            <p className="text-gray-700">
              {value ||
                'No phone number'}
            </p>
          )}
          renderEditor={({
            draft,
            setDraft,
          }) => (
            <Input
              value={draft}
              placeholder="98XXXXXXXX"
              onChange={(e) =>
                setDraft(
                  e.target.value
                )
              }
            />
          )}
        />

        {/* AGE */}

        {profile.account_type ===
          'personal' && (
          <EditableProfileSection
            id="age"
            title="Age"
            editable={editable}
            activeId={activeId}
            onActivate={setActiveId}
            onDeactivate={() =>
              setActiveId(null)
            }
            value={profile.age ?? 0}
            isSaving={isLoading}
            onSave={(draft) => 
              saveField({
                age: draft,
              })
            }
            renderDisplay={(value) => (
              <p className="text-gray-700">
                {value
                  ? `${value} years`
                  : 'Not specified'}
              </p>
            )}
            renderEditor={({
              draft,
              setDraft,
            }) => (
              <Input
                type="number"
                min={16}
                max={100}
                value={draft}
                onChange={(e) =>
                  setDraft(
                    Number(
                      e.target.value
                    )
                  )
                }
              />
            )}
          />
        )}

        {/* GENDER */}

        {profile.account_type ===
          'personal' && (
          <EditableProfileSection
            id="gender"
            title="Gender"
            editable={editable}
            activeId={activeId}
            onActivate={setActiveId}
            onDeactivate={() =>
              setActiveId(null)
            }
            value={profile.gender}
           isSaving={isLoading}
            onSave={(draft) => 
            saveField({
                gender: draft,
              })
            }
            renderDisplay={(value) => (
              <p className="text-gray-700 capitalize">
                {value
                  ?.replace(
                    '_',
                    ' '
                  ) || 'Not specified'}
              </p>
            )}
            renderEditor={({
              draft,
              setDraft,
            }) => (
              <select
                value={draft}
                onChange={(e) =>
                setDraft(
                    e.target.value as
                    | 'male'
                    | 'female'
                    | 'other'
                    | 'not_specified'
                )
                }
                className="w-full rounded-lg border border-outline-variant px-4 py-2"
              >
                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>

                <option value="not_specified">
                  Prefer not to say
                </option>
              </select>
            )}
          />
        )}

      </div>

    </div>
  );
}