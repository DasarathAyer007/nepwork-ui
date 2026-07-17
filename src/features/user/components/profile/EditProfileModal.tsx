import { useState } from 'react';
import type { UserDetails } from '@/types/user.types';
import { useUpdateProfileMutation } from '../../api/profileApi';

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  profileDetails: UserDetails;
};

function EditProfileModal({
  open,
  onClose,
  profileDetails,
}: EditProfileModalProps) {
  const [updateProfile, { isLoading }] =
    useUpdateProfileMutation();

  const [bio, setBio] = useState(
    profileDetails.bio ?? ''
  );

  const [phoneNumber, setPhoneNumber] =
    useState(
      profileDetails.phone_number ?? ''
    );

  const [dateOfBirth, setDateOfBirth] =
    useState(
      profileDetails.account_type ===
        'personal'
        ? profileDetails.date_of_birth ??
            ''
        : ''
    );

  const [facebook, setFacebook] =
    useState(
      profileDetails.social_links
        ?.facebook ?? ''
    );

  const [linkedin, setLinkedin] =
    useState(
      profileDetails.social_links
        ?.linkedin ?? ''
    );

  const [github, setGithub] = useState(
    profileDetails.social_links?.github ??
      ''
  );

  const [profilePicture, setProfilePicture] =
    useState<File | null>(null);

  const [coverPhoto, setCoverPhoto] =
    useState<File | null>(null);

  const [skills, setSkills] = useState(
    profileDetails.account_type ===
      'personal'
      ? (profileDetails.skills ?? [])
          .map((skill) => skill.name)
          .join(', ')
      : ''
  );

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append(
        'phone_number',
        phoneNumber
      );

      formData.append('bio', bio);

      const socialLinks = {
        ...(facebook && {
          facebook,
        }),
        ...(linkedin && {
          linkedin,
        }),
        ...(github && {
          github,
        }),
      };

      formData.append(
        'social_links',
        JSON.stringify(socialLinks)
      );

      if (
        profileDetails.account_type ===
        'personal'
      ) {
        if (dateOfBirth) {
          formData.append(
            'date_of_birth',
            dateOfBirth
          );
        }

        skills
          .split(',')
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean)
          .forEach((skill) => {
            formData.append(
              'skills',
              skill
            );
          });
      }

      if (profilePicture) {
        formData.append(
          'profile_picture',
          profilePicture
        );
      }

      if (coverPhoto) {
        formData.append(
          'cover_photo',
          coverPhoto
        );
      }

      for (const pair of formData.entries()) {
        console.log(
          pair[0],
          pair[1]
        );
      }

      await updateProfile(
        formData
      ).unwrap();

      window.location.reload();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="text-xl font-semibold">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-xl">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div>
            <label className="block mb-2 font-medium">
              Profile Picture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePicture(
                  e.target.files?.[0] ||
                    null
                )
              }
            />

            {profilePicture && (
              <img
                src={URL.createObjectURL(
                  profilePicture
                )}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mt-3"
              />
            )}
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block mb-2 font-medium">
              Cover Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverPhoto(
                  e.target.files?.[0] ||
                    null
                )
              }
            />

            {coverPhoto && (
              <img
                src={URL.createObjectURL(
                  coverPhoto
                )}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl mt-3"
              />
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Bio
            </label>

            <textarea
              rows={4}
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              className="w-full border border-outline-variant rounded-xl p-3"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value
                )
              }
              className="w-full border border-outline-variant rounded-xl p-3"
            />
          </div>

          {/* Date of Birth */}
          {profileDetails.account_type ===
            'personal' && (
            <div>
              <label className="block mb-2 font-medium">
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
                className="w-full border border-outline-variant rounded-xl p-3"
              />
            </div>
          )}

          {/* Social Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">
              Social Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Facebook URL"
                value={facebook}
                onChange={(e) =>
                  setFacebook(
                    e.target.value
                  )
                }
                className="w-full border border-outline-variant rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="LinkedIn URL"
                value={linkedin}
                onChange={(e) =>
                  setLinkedin(
                    e.target.value
                  )
                }
                className="w-full border border-outline-variant rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="GitHub URL"
                value={github}
                onChange={(e) =>
                  setGithub(
                    e.target.value
                  )
                }
                className="w-full border border-outline-variant rounded-xl p-3"
              />
            </div>
          </div>

          {/* Skills */}
          {profileDetails.account_type ===
            'personal' && (
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">
                Skills
              </label>

              <input
                type="text"
                value={skills}
                onChange={(e) =>
                  setSkills(
                    e.target.value
                  )
                }
                placeholder="React, Django, Python"
                className="w-full border border-outline-variant rounded-xl p-3"
              />

              <p className="text-xs text-on-surface-variant mt-2">
                Separate skills with commas.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-outline rounded-xl">
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2 bg-primary text-white rounded-xl disabled:opacity-50">
            {isLoading
              ? 'Saving...'
              : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;