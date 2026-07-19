import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/app/hooks';
import type { RootState } from '@/app/store';

import { useUpdateProfileMutation } from '@/features/user/api/profileApi';

import type { UserDetails } from '@/types/user.types';

import {
  BadgeCheck,
  Building,
  Camera,
  ImagePlus,
  Loader2,
  MapPin,
  Pencil,
  UserRound,
} from 'lucide-react';

type IntroHeaderProps = {
  profileDetails: UserDetails;
  editMode: boolean;
  setEditMode: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function IntroHeader({
  profileDetails,
  editMode,
  setEditMode,
}: IntroHeaderProps) {
  const navigate = useNavigate();

  const authUser = useAppSelector(
    (state: RootState) => state.auth.user
  );

  const isOwner =
    authUser?.username ===
    profileDetails.username;

  const isOrg =
    profileDetails.account_type ===
    'organization';

  const profileInputRef =
    useRef<HTMLInputElement>(null);

  const coverInputRef =
    useRef<HTMLInputElement>(null);

  const [
    updateProfile,
    { isLoading: isUploading },
  ] = useUpdateProfileMutation();

  const handleMessageClick = () => {
    const params = new URLSearchParams({
      userId: profileDetails.id,
      username: profileDetails.username,
      profile_picture:
        profileDetails.profile_picture ??
        '',
      fullName:
        profileDetails.full_name,
    });

    navigate(
      `/messages?${params.toString()}`
    );
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  async function uploadProfilePicture(
    file: File
  ) {
    try {
      const formData = new FormData();

      formData.append(
        'profile_picture',
        file
      );

      await updateProfile(
        formData
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  async function uploadCoverPhoto(
    file: File
  ) {
    try {
      const formData = new FormData();

      formData.append(
        'cover_photo',
        file
      );

      await updateProfile(
        formData
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  const getLocationText = () => {
    const location =
      profileDetails.location;

    if (!location) {
      return 'Location not available';
    }

    const parts: string[] = [];

    if (
      'city' in location &&
      location.city
    ) {
      parts.push(location.city);
    }

    if (
      'state' in location &&
      location.state
    ) {
      parts.push(location.state);
    }

    if (
      'country' in location &&
      location.country
    ) {
      parts.push(location.country);
    }

    return parts.length
      ? parts.join(', ')
      : 'Location not available';
  };

  const locationText =
    getLocationText();

  return (
    <>
      {/* Hidden Inputs */}

      <input
        hidden
        ref={profileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file =
            e.target.files?.[0];

          if (file) {
            uploadProfilePicture(file);
          }

          e.target.value = '';
        }}
      />

      <input
        hidden
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file =
            e.target.files?.[0];

          if (file) {
            uploadCoverPhoto(file);
          }

          e.target.value = '';
        }}
      />
      <header className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">

        {/* ================= COVER PHOTO ================= */}

        <div className="relative h-64 md:h-80 w-full">

          {profileDetails.cover_photo ? (
            <img
              src={profileDetails.cover_photo}
              alt="Cover Photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

          {isOwner && editMode && (
            <button
              type="button"
              disabled={isUploading}
              onClick={() =>
                coverInputRef.current?.click()
              }
              className="absolute right-5 top-5 flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-white backdrop-blur transition hover:bg-black/75 disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <ImagePlus size={18} />
              )}

              <span className="hidden sm:block">
                Change Cover
              </span>
            </button>
          )}

        </div>

        {/* ================= PROFILE INFO ================= */}

        <div className="relative z-10 flex flex-col gap-6 px-8 pb-8 md:flex-row md:items-end">

          {/* Avatar */}

          <div className="relative -mt-16 md:-mt-20">

            <div className="relative h-36 w-36 overflow-hidden rounded-3xl border-4 border-white bg-surface-container shadow-xl md:h-44 md:w-44">

              {profileDetails.profile_picture ? (
                <img
                  src={profileDetails.profile_picture}
                  alt={profileDetails.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserRound
                    size={72}
                    className="text-on-surface-variant"
                  />
                </div>
              )}

            </div>

            {isOwner && editMode && (
              <button
                type="button"
                disabled={isUploading}
                onClick={() =>
                  profileInputRef.current?.click()
                }
                className="absolute bottom-2 left-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Camera size={18} />
                )}
              </button>
            )}

            <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-secondary shadow-md">
              <BadgeCheck size={20} />
            </div>

          </div>

          {/* User Details */}

          <div className="flex-1 pb-2">

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold text-on-surface">
                {profileDetails.full_name}
              </h1>

              <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">

                {isOrg ? (
                  <Building size={15} />
                ) : (
                  <UserRound size={15} />
                )}

                {isOrg
                  ? 'Organization'
                  : 'Individual'}

              </span>

            </div>

            <p className="mt-2 text-base text-on-surface-variant">
              @{profileDetails.username}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">

              <MapPin size={16} />

              <span>{locationText}</span>

            </div>

          </div>
          {/* ================= ACTION BUTTONS ================= */}

          <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">

            {isOwner && !editMode && (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Pencil size={14} />
                Click Edit Profile to make changes
              </div>
            )}

            <div className="flex gap-3">

              {!isOwner && (
                <button
                  type="button"
                  onClick={handleMessageClick}
                  className="rounded-xl border border-primary px-6 py-2 font-medium text-primary transition hover:bg-primary/10"
                >
                  Message
                </button>
              )}

              {isOwner && (
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className={`rounded-xl px-6 py-2 font-medium text-white transition ${
                    editMode
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-primary hover:opacity-90'
                  }`}
                >
                  {editMode
                    ? 'Done Editing'
                    : 'Edit Profile'}
                </button>
              )}

            </div>

          </div>

        </div>

      </header>
    </>
  );
}