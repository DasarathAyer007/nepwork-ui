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
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">

      <div className="px-6 py-5 border-b border-outline-variant">
        <h2 className="text-2xl font-semibold text-on-surface">
          About Me
        </h2>

        {editable && (
          <p className="mt-1 text-sm text-on-surface-variant">
            Update your personal information.
          </p>
        )}
      </div>

      <div className="divide-y divide-outline-variant px-6">

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
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-on-surface">
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


      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
            <div className="rounded-xl bg-surface-container border border-outline-variant p-4">
              <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                Phone Number
              </p>

              <p className="mt-2 text-base font-semibold text-on-surface">
                {value || 'Not specified'}
              </p>
            </div>
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
              <div className="rounded-xl bg-surface-container border border-outline-variant p-4">
                <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                  Age
                </p>

                <p className="mt-2 text-base font-semibold text-on-surface">
                  {value ? `${value} Years` : 'Not specified'}
                </p>
              </div>
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
              <div className="rounded-xl bg-surface-container border border-outline-variant p-4">
                <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                  Gender
                </p>

                <p className="mt-2 text-base font-semibold capitalize text-on-surface">
                  {value?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
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

    </div>
  );
}