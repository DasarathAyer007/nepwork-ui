import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import { useAppSelector } from '@/app/hooks';
import type { RootState } from '@/app/store';
import type { UserDetails } from '@/types/user.types';
import {
  BadgeCheck,
  Building,
  Camera,
  ImagePlus,
  MapPin,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useAppSelector } from '@/store/hooks';
// import type { RootState } from '@/store';

type IntroHeaderProps = {
  profileDetails: UserDetails;
};

function IntroHeader({ profileDetails }: IntroHeaderProps) {
  const navigate = useNavigate();

  // Replace later with your actual auth user
  // const authUser = useAppSelector(
  //   (state: RootState) => state.auth.user
  // );

  const isOrg =
    profileDetails.account_type === 'organization';

  const authUser = useAppSelector(
    (state: RootState) => state.auth.user
  );

  const isOwner =
    authUser?.username === profileDetails.username;
  // const isOwner =
  //   authUser?.username === profileDetails.username;

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const handleMessageClick = () => {
    const params = new URLSearchParams({
      userId: profileDetails.id,
      username: profileDetails.username,
      profile_picture:
        profileDetails.profile_picture || '',
      fullName: profileDetails.full_name,
    });

    navigate(`/messages?${params.toString()}`);
  };

  const handleEditProfilePicture = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCoverPhoto = () => {
    setIsEditModalOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const getLocationText = () => {
    const location = profileDetails.location;

    if (!location) {
      return 'Location not available';
    }

    const parts: string[] = [];

    if ('city' in location && location.city) {
      parts.push(location.city);
    }

    if ('state' in location && location.state) {
      parts.push(location.state);
    }

    if ('country' in location && location.country) {
      parts.push(location.country);
    }

    return parts.length
      ? parts.join(', ')
      : 'Location not available';
  };

  const locationText = getLocationText();

  return (
    <>
      <header className="relative mb-xl bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant">
        {/* ================= COVER PHOTO ================= */}
        <div className="h-64 md:h-80 w-full relative bg-surface-container-high">
          {profileDetails.cover_photo ? (
            <img
              src={profileDetails.cover_photo}
              alt="Cover photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {isOwner && (
            <button
              onClick={handleEditCoverPhoto}
              className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-black/75 transition"
            >
              <ImagePlus size={18} />
              <span className="hidden sm:block">
                Change Cover
              </span>
            </button>
          )}
        </div>

        {/* ================= PROFILE SECTION ================= */}
        <div className="px-lg pb-lg flex flex-col md:flex-row items-end gap-md relative z-10">
          {/* ================= AVATAR ================= */}
          <div className="relative -mt-16 md:-mt-20">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-surface-container-lowest bg-surface-container-high overflow-hidden shadow-lg flex items-center justify-center">
              {profileDetails.profile_picture ? (
                <img
                  src={profileDetails.profile_picture}
                  alt={`${profileDetails.full_name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound
                  size={60}
                  className="text-on-surface-variant"
                />
              )}
            </div>

            {isOwner && (
              <button
                onClick={handleEditProfilePicture}
                className="absolute bottom-2 left-2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
              >
                <Camera size={18} />
              </button>
            )}

            <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-secondary text-on-secondary border-4 border-surface-container-lowest flex items-center justify-center shadow-md">
              <BadgeCheck size={20} />
            </div>
          </div>

          {/* ================= USER INFO ================= */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-xs flex-wrap">
              <h1 className="text-headline-lg font-headline-lg text-on-surface">
                {profileDetails.full_name}
              </h1>

              <span className="text-primary font-label-md text-label-md px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1">
                {isOrg ? (
                  <Building size={16} />
                ) : (
                  <UserRound size={16} />
                )}

                <span className="text-xs">
                  {isOrg
                    ? 'Organization'
                    : 'Individual'}
                </span>
              </span>
            </div>

            <p className="text-body-lg font-body-lg text-on-surface-variant mt-1">
              @{profileDetails.username}
            </p>

            <div className="flex items-center gap-2 mt-3 text-on-surface-variant">
              <MapPin
                size={16}
                className="shrink-0"
              />

              <span className="text-sm">
                {locationText}
              </span>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex gap-sm mb-2 w-full md:w-auto">
            {!isOwner && (
              <button
                onClick={handleMessageClick}
                className="flex-1 md:flex-none px-xl py-xs border border-primary text-primary rounded-xl font-label-md text-label-md hover:bg-primary/10 transition-colors"
              >
                Message
              </button>
            )}

            {isOwner && (
              <button
                onClick={handleEditProfile}
                className="flex-1 md:flex-none px-xl py-xs bg-primary text-white rounded-xl font-label-md text-label-md hover:opacity-90 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Edit Modal goes here later */}
      {isEditModalOpen && (
        <div>
          {/* We'll build this next */}
        </div>
      )}

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileDetails={profileDetails}
      />
    </>
  );
}

export default IntroHeader;